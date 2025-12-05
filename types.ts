export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  groundingMetadata?: GroundingMetadata;
}

export interface GroundingMetadata {
  groundingChunks?: {
    web?: {
      uri?: string;
      title?: string;
    };
  }[];
}

export interface CatFact {
  title: string;
  description: string;
  icon: string;
}

export const SUGGESTED_QUESTIONS: CatFact[] = [
  {
    title: "三花猫的基因秘密",
    description: "为什么三花猫绝大多数是女孩子？",
    icon: "🧬"
  },
  {
    title: "曼赤肯猫的外形",
    description: "短腿猫咪的骨骼结构健康吗？",
    icon: "🐾"
  },
  {
    title: "猫咪呼噜声",
    description: "猫咪为什么会发出呼噜呼噜的声音？",
    icon: "💤"
  },
  {
    title: "布偶猫的特征",
    description: "为什么布偶猫被称为'仙女猫'？",
    icon: "🎀"
  }
];