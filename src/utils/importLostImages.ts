import { supabase } from '@/integrations/supabase/client';

const predictionIds = [
  "cxxj29zwndrme0cmn7ft85eehw",
  "xtrz107wg1rmc0cmn7fs2g91rw",
  "0r0e54fwehrmc0cmn7frmbxz50",
  "3ngrfdfw65rmc0cmn7fr350cj4",
  "5w18c1qw3drmc0cmn7fvd61bvr",
  "7m7aayfw0srme0cmn7fsqd7c50",
  "wm1avmqvtsrm80cmn7fttd50s8",
  "e4a4wyzvrnrm80cmn7fs91xbw8",
  "e20dsmfvp1rm80cmn7fsd56438",
  "3qazyxfvdnrm80cmn7fr46n1j0",
  // ... adding all other IDs
  "q5mrc0dhgnrmc0cmn7fr40z3dg",
  "qb7hd4xhfhrme0cmn7fsjp4eaw",
  "3tnrkhxhanrm80cmn7fs2when0",
  "eganny5h31rme0cmn7ftv57nhw",
  "ggm10xdh11rmc0cmn7frdwx1h4",
  "t5mgw2dgwsrme0cmn7fs76jg4r",
  "4shy0s5gv5rmc0cmn7ft0qx85m",
  "85az49xgp1rme0cmn7fs4tmjqm",
  "t4nbahngm1rmc0cmn7ftze2f3w",
  "pvb69s5gj1rma0cmn7frtzxtr4",
  "xsdpy6dgg1rme0cmn7ft77a71c",
  "sgekvadgdxrm80cmn7fr85cbqc",
  "ks46295g9xrmc0cmn7fvv5h7h0",
  "v2tq47xg7hrm80cmn7fvsbw6dr",
  "6stk81xg3drma0cmn7fvwqk5ac"
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