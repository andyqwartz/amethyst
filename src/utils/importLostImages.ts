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
  "8gt28zfvahrm80cmn7fsfe3hgr",
  "gsf8xeqv59rmc0cmn7frp4nv88",
  "pkpnjxzv55rmc0cmn7fs9x88hg",
  "6d211xqtzsrmc0cmn7fr81x1ec",
  "b1akzeztx9rma0cmn7fserdqp4",
  "9xe6t0ftw5rm80cmn7fsf6c8p0",
  "ge70p67tnsrme0cmn7fvjvc1dg",
  "04x2x7ztdnrm80cmn7fs5xh0hg",
  "6cef3fqt95rme0cmn7fsrq680m",
  "q25wkyft7xrm80cmn7fs5r8y3g",
  "a89800ft6hrmc0cmn7frjefmrg",
  "7gxykvqsyxrme0cmn7frjv2970",
  "0f941y7swnrm80cmn7fvxgbd2m",
  "7894q2fss9rma0cmn7frj5cn2c",
  "g2t4jdfsn1rm80cmn7frf3a6yw",
  "5efsm5fsc9rma0cmn7fsqvzy8g",
  "rm5qjhfs8drme0cmn7frt60fjr",
  "1k3fyv7s59rmc0cmn7ftmab4rr",
  "93wxvyfs1hrm80cmn7ftzffz0m",
  "kd70nwqrwhrma0cmn7frfe22tw",
  "31p839zrw9rmc0cmn7fr05fhym",
  "2afy5w7rtxrme0cmn7fts3yh3m",
  "kzkj6ffrtdrmc0cmn7fs1syr0c",
  "e0hap8zrr1rmc0cmn7fr86d5c8",
  "6gx33wfra5rma0cmn7frnjkzgw",
  "w83fbxzqn9rmc0cmn7fs5t1gp8",
  "cabqvjqqm9rma0cmn7frse08xm",
  "6p3tdb7prnrme0cmn7fvej6rk8",
  "qef7n0zpr1rme0cmn7fsmtvyyw",
  "2ckt2fzp6drmc0cmn7fs7wgjqc",
  "9ec24pzp59rm80cmn7fswq659g",
  "0fjn8ezp4xrm80cmn7fs3ftj1c",
  "gjafdafp4srm80cmn7fsq83xqc",
  "fc6c14qp4hrm80cmn7frcyrfe8",
  "dt4ymvzp49rme0cmn7ftejd018",
  "b26jq2qp41rma0cmn7fvqq1jj8",
  "mkkekkzp3xrme0cmn7fs8nfjtr",
  "7ajq1h7p3nrme0cmn7ftth7s8m",
  "bk2bg77p35rma0cmn7fsxvcdn8",
  "0gqh6afp35rm80cmn7frpxydn0",
  "xsn14s7p2drmc0cmn7fsze9b0g",
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