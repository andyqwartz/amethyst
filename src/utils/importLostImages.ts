import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const predictionIds = [
  "92wdz9wp79rme0cmn7g883b7c8",
  "stwxyrwnjsrme0cmn7gbgqyngw",
  "ng72x4wnjhrmc0cmn7gat8r4ym",
  "s6gf3gmnjhrm80cmn7gbbymr5g",
  "j2zbwdcnj9rm80cmn7g8dk5fbc",
  "wpcpjr4ngnrmc0cmn7gbyrzc1w",
  "9ezsngwnfnrmc0cmn7gaeasbq8",
  "p0x1rrmnf5rma0cmn7gapjpqj4",
  "w55hbqwnexrma0cmn7gbwgvh7g",
  "00wewk4ncxrma0cmn7gb6vfjyc",
  "z94hspwnc1rmc0cmn7ga4n2cd4",
  "6t5ae2wnbdrme0cmn7g8akghv4",
  "k6m1k2mnbdrme0cmn7g9ajt368",
  "rza6tdmnb5rme0cmn7g85zfp1g",
  "z3222k4n9xrma0cmn7gad4ggcr",
  "c9scngmn9nrmc0cmn7g8pkjf3c",
  "9ap9t3cn85rma0cmn7gb4wdc3c",
  "t2jt674n81rmc0cmn7g9h86sew",
  "gb0ey04n55rme0cmn7g8mtc4jm",
  "3fcy7p4n3xrmc0cmn7gbm06v1c",
  "kz89mtmn2xrma0cmn7g9r3jfz0",
  "tymy46wn2hrm80cmn7gb3nxjv8",
  "0s2jwdcn19rm80cmn7g996dts8",
  "b3rv2ywmxdrme0cmn7gah4wy0r",
  "5zkat34mw5rma0cmn7g9tgdvd8",
  "y6xs8jcmtsrma0cmn7gav7wqz8",
  "myg3ktcmr9rme0cmn7g9zb93tc",
  "54hrfdwmr1rma0cmn7gaqk8fb0",
  "jcr3egwmndrme0cmn7gbrktwc0",
  "vm5777cmn1rma0cmn7gbv26wp8",
  "43124q4mjxrma0cmn7gac7q4jm",
  "8szvnr4mfdrmc0cmn7g9rh04gg",
  "4yerqtwmexrmc0cmn7gbea2y2w",
  "qadnmqwmd9rmc0cmn7g9wwpj4g",
  "a9amz7mmbnrme0cmn7gaz49h18",
  "ncqw50r3tnrme0cmn7g80a16mw",
  "tgz1bp837srma0cmn7ga0n11ym",
  "zragws8329rme0cmn7gadwbw9g",
  "hah7jgr2y9rm80cmn7gaysyjpg",
  "ve857n82xsrmc0cmn7gay6z5dm",
  "fgmknpg2rdrmc0cmn7gamwed2c",
  "0z4fvcr2mnrmc0cmn7gbfs6ew4",
  "73xn3402k5rma0cmn7gbp57s1w",
  "rtgm3802j1rme0cmn7gafevgcr",
  "vamdzsg2e9rma0cmn7gap8n9rm",
  "svr8hvr2a9rma0cmn7gbbkhe9c",
  "qf9m6w8285rma0cmn7gb9m7qjw",
  "mdrd6e026hrmc0cmn7gb91x7rg",
  "cy4qgx81x1rm80cmn7gb9ebznc",
  "bf3mzs81vsrmc0cmn7g8qn7pdm",
  "mce0g47jmsrm80cmn7fr6a22pw",
  "jeqkmvfjjnrme0cmn7fsg66fn0",
  "8yn309qj5hrm80cmn7fs0djrnw",
  "xytbrgfj3hrmc0cmn7fr4a1ner",
  "mtsmhpqhqxrmc0cmn7fsw2tz44",
  "w3rt0hzhmdrm80cmn7fr7r68sm",
  "8wf4tqfhhdrma0cmn7fs7k9fw8",
  "b3pqcvqhedrmc0cmn7fscg6e9c",
  "7q25yrzhbhrm80cmn7ftqqmt2w",
  "53vkqbzh65rma0cmn7frrp02t4",
  "jj7n4e7h59rme0cmn7fthd2ybc",
  "3btpt37h21rma0cmn7frwz1qj8",
  "y189f6qgzsrmc0cmn7frw4m17r",
  "rz4bgdzgqhrme0cmn7fryftrw0",
  "3xnchxzgk5rmc0cmn7fvgqrnf8",
  "q8ekd2qgj1rma0cmn7frw01b78",
  "fcz1vwqg89rma0cmn7ftv89dqr",
  "p14pzyfg71rma0cmn7frwfatbc",
  "b45xx57g5nrme0cmn7ft67nhg8",
  "033rmgzg0hrmc0cmn7frcdd8w4",
  "wrm6s6ffv1rma0cmn7freratp8",
  "9q9zmh7fshrme0cmn7fs2p34jm",
  "qjr8ef7fjhrma0cmn7fsvj01yc",
  "haykz87fe9rme0cmn7fvf39enc",
  "1dyypcqf9srm80cmn7fsn6rrc8",
  "r8zpkqff39rma0cmn7fteat5g4",
  "h35f5wqf25rm80cmn7ftxntpd8",
  "5kh0befezsrme0cmn7ft4bxhmc",
  "40wfpgfesxrme0cmn7ftsgp5yc",
  "j3d5397ensrm80cmn7fs7fvfjc",
  "6hft7z7ek5rma0cmn7frmebks4",
  "shr9bmfea1rma0cmn7fvjw5r1r",
  "stfa18zea1rm80cmn7fv65wmxc",
  "85wyf1ze5xrme0cmn7ft0sbpr8",
  "qcarnsfe4drm80cmn7fsnamjs8",
  "1hb4dsze2hrmc0cmn7fsb71zxm",
  "54yjk77e1nrmc0cmn7fsjfytqm",
  "bgwfejfdxhrmc0cmn7ft94h4nw",
  "d803g5zdv9rma0cmn7fthzez40",
  "m4y4m7fdp5rma0cmn7fthz1d48",
  "rwhn23qdk9rmc0cmn7fv702xgg",
  "cj9g0rzdb5rme0cmn7fr8jm5j4",
  "ch4s60qd7hrm80cmn7ftwjaqhg",
  "dg8c0sqd05rmc0cmn7ftqehztg",
  "wk8b6qzcsxrme0cmn7fv91ewd0",
  "6yezye7cqdrm80cmn7fsnw93r0",
  "s0h75tzcknrm80cmn7fspz61yr",
  "34pbgpqchxrme0cmn7fsjef52r",
  "5akmqczchsrm80cmn7fsfxp058",
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
  "6stk81xg3drma0cmn7fvwqk5ac",
  "5rtjzccq55rmc0cmn7ftqx38m8",
  "n84s13mq8nrme0cmn7fvn5kj10",
  "83jchgcq91rmc0cmn7fvt2rbtr",
  "cyq6z5mqahrmc0cmn7frkn5s2g",
  "4swf334qc5rm80cmn7ftqpn0n0",
  "555529wqmsrm80cmn7frd1npp8"
];

export const importLostImages = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    toast({
      title: "Error",
      description: "You must be logged in to import images",
      variant: "destructive"
    });
    return;
  }

  toast({
    title: "Starting import",
    description: "Importing images to your history...",
  });

  let successCount = 0;
  let failCount = 0;

  const defaultSettings = {
    prompt: "Restored image",
    negativePrompt: "",
    guidanceScale: 7.5,
    steps: 30,
    numOutputs: 1,
    aspectRatio: "1:1",
    outputFormat: "webp",
    outputQuality: 90,
    promptStrength: 0.8,
    hfLoras: [],
    loraScales: [],
    disableSafetyChecker: false
  };

  for (const id of predictionIds) {
    try {
      const url = `https://replicate.delivery/pbxt/${id}/output.png`;
      
      const { error } = await supabase
        .from('images')
        .insert({
          url,
          settings: defaultSettings,
          user_id: user.id,
          ...defaultSettings,
          generation_id: id
        });

      if (error) throw error;
      successCount++;
    } catch (error) {
      console.error(`Failed to import image ${id}:`, error);
      failCount++;
    }
  }

  if (failCount > 0) {
    toast({
      title: "Import partially complete",
      description: `Successfully imported ${successCount} images. ${failCount} failed.`,
      variant: "destructive",
      duration: 5000,
    });
  } else {
    toast({
      title: "Import complete",
      description: `Successfully imported ${successCount} images.`,
      duration: 3000,
    });
  }
};