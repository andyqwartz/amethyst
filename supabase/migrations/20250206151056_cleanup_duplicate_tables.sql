-- First, migrate any data from credits_transactions to credit_transactions if needed
INSERT INTO credit_transactions (
    id,
    profile_id,
    type,
    amount,
    description,
    metadata,
    created_at
)
SELECT 
    id,
    profile_id,
    type,
    amount,
    description,
    metadata,
    created_at
FROM credits_transactions
ON CONFLICT (id) DO NOTHING;

-- Drop the duplicate credits_transactions table
DROP TABLE IF EXISTS credits_transactions;

-- Add any missing indexes to credit_transactions
DROP INDEX IF EXISTS idx_credit_transactions_profile_id;
DROP INDEX IF EXISTS idx_credit_transactions_type;
DROP INDEX IF EXISTS idx_credit_transactions_created_at;

CREATE INDEX IF NOT EXISTS idx_credit_transactions_profile_id 
    ON credit_transactions(profile_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type 
    ON credit_transactions(type);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at 
    ON credit_transactions(created_at);

-- Ensure RLS policies are properly set
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own credit transactions" ON credit_transactions;
DROP POLICY IF EXISTS "System can insert credit transactions" ON credit_transactions;
DROP POLICY IF EXISTS "Admins can view all credit transactions" ON credit_transactions;

-- Recreate policies with proper permissions
CREATE POLICY "Users can view their own credit transactions"
    ON credit_transactions FOR SELECT
    TO authenticated
    USING (profile_id = auth.uid() OR EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND is_admin = true
    ));

CREATE POLICY "System can insert credit transactions"
    ON credit_transactions FOR INSERT
    TO authenticated
    WITH CHECK (profile_id = auth.uid());

-- Add constraints to ensure data integrity
ALTER TABLE credit_transactions 
    DROP CONSTRAINT IF EXISTS credit_transactions_profile_id_fkey;

ALTER TABLE credit_transactions
    ADD CONSTRAINT credit_transactions_profile_id_fkey
    FOREIGN KEY (profile_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE;

-- Add check constraints for valid transaction types
ALTER TABLE credit_transactions
    DROP CONSTRAINT IF EXISTS credit_transactions_type_check;

ALTER TABLE credit_transactions
    ADD CONSTRAINT credit_transactions_type_check
    CHECK (type IN ('purchase', 'reward', 'ad_view', 'subscription', 'refund', 'adjustment'));

-- Add check constraint for valid amounts
ALTER TABLE credit_transactions
    DROP CONSTRAINT IF EXISTS credit_transactions_amount_check;

ALTER TABLE credit_transactions
    ADD CONSTRAINT credit_transactions_amount_check
    CHECK (amount IS NOT NULL);

-- Update function to handle credit transactions
CREATE OR REPLACE FUNCTION handle_credit_transaction()
RETURNS trigger AS $$
BEGIN
    -- Update profile credits balance
    UPDATE profiles
    SET credits_balance = credits_balance + NEW.amount,
        lifetime_credits = CASE 
            WHEN NEW.amount > 0 THEN lifetime_credits + NEW.amount
            ELSE lifetime_credits
        END,
        last_credit_update = now()
    WHERE id = NEW.profile_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace trigger for credit transactions
DROP TRIGGER IF EXISTS on_credit_transaction ON credit_transactions;

CREATE TRIGGER on_credit_transaction
    AFTER INSERT ON credit_transactions
    FOR EACH ROW
    EXECUTE FUNCTION handle_credit_transaction();

-- Grant necessary permissions
GRANT SELECT, INSERT ON credit_transactions TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE credit_transactions_id_seq TO authenticated;
