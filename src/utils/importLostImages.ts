import { supabase } from '@/integrations/supabase/client';

const predictionIds = [
  "92wdz9wp79rme0cmn7g883b7c8",
  "stwxyrwnjsrme0cmn7gbgqyngw",
  // ... add all other IDs here
];

export const importLostImages = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('No user logged in');
    return;
  }

  const defaultSettings = {
    prompt: "Restored image",
    negativePrompt: "",
    guidanceScale: 7.5,
    steps: 30,
    numOutputs: 1,
    aspectRatio: "1:1",
    outputFormat: "webp",
    outputQuality: 90,
    promptStrength: 0.8
  };

  const images = predictionIds.map(id => ({
    url: `https://replicate.delivery/pbxt/${id}/output.png`,
    settings: defaultSettings,
    user_id: user.id,
    ...defaultSettings
  }));

  const { error } = await supabase
    .from('images')
    .insert(images);

  if (error) {
    console.error('Error importing images:', error);
  } else {
    console.log('Successfully imported lost images');
  }
};