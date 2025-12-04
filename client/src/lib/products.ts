import p1_1 from "@assets/P1/1.jpg";
import p1_2 from "@assets/P1/2.jpg";
import p1_3 from "@assets/P1/3.jpg";
import p1_4 from "@assets/P1/4.jpg";

import p2_1 from "@assets/P2/1.jpg";
import p2_2 from "@assets/P2/2.jpg";
import p2_3 from "@assets/P2/3.jpg";
import p2_4 from "@assets/P2/4.jpg";

import p3_1 from "@assets/P3/1.jpg";
import p3_2 from "@assets/P3/2.jpg";
import p3_3 from "@assets/P3/3.jpg";
import p3_4 from "@assets/P3/4.jpg";

import p4_1 from "@assets/P4/1.jpg";
import p4_2 from "@assets/P4/2.jpg";
import p4_3 from "@assets/P4/3.jpg";
import p4_4 from "@assets/P4/4.jpg";

import p5_1 from "@assets/P5/1.jpg";
import p5_2 from "@assets/P5/2.jpg";
import p5_3 from "@assets/P5/3.jpg";
import p5_4 from "@assets/P5/4.jpg";

import p6_1 from "@assets/P6/1.jpg";
import p6_2 from "@assets/P6/2.jpg";
import p6_3 from "@assets/P6/3.jpg";
import p6_4 from "@assets/P6/4.jpg";

const productImages: Record<string, string> = {
  "P1/1.jpg": p1_1,
  "P1/2.jpg": p1_2,
  "P1/3.jpg": p1_3,
  "P1/4.jpg": p1_4,
  "P2/1.jpg": p2_1,
  "P2/2.jpg": p2_2,
  "P2/3.jpg": p2_3,
  "P2/4.jpg": p2_4,
  "P3/1.jpg": p3_1,
  "P3/2.jpg": p3_2,
  "P3/3.jpg": p3_3,
  "P3/4.jpg": p3_4,
  "P4/1.jpg": p4_1,
  "P4/2.jpg": p4_2,
  "P4/3.jpg": p4_3,
  "P4/4.jpg": p4_4,
  "P5/1.jpg": p5_1,
  "P5/2.jpg": p5_2,
  "P5/3.jpg": p5_3,
  "P5/4.jpg": p5_4,
  "P6/1.jpg": p6_1,
  "P6/2.jpg": p6_2,
  "P6/3.jpg": p6_3,
  "P6/4.jpg": p6_4,
};

export function getProductImage(imagePath: string): string {
  return productImages[imagePath] || p1_1;
}
