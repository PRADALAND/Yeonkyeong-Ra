import { ScenarioStage, StageType, PatientProfile } from './types';

export const PATIENT_PROFILE: PatientProfile = {
  name: "김철수 (가명)",
  age: 62,
  condition: "진행성 폐암 (표준 항암요법 실패)",
  status: "복합적 감정 (불안, 피로)",
  vitals: {
    hr: 88,
    bp: "135/85",
    spo2: 96
  },
  history: "2년 전 비소세포폐암 진단 후 1차 항암화학요법 및 방사선 치료를 시행하였으나 최근 추적 검사에서 다발성 뼈 전이가 확인됨. 주치의로부터 완치 목적의 치료는 어렵다는 소견을 들음.",
  social: "자영업 종사자였으나 투병 후 은퇴. 아내와 2녀(모두 출가)가 있음. 가족에게 짐이 되는 것을 극도로 경계함."
};

export const SCENARIO_DATA: ScenarioStage[] = [
  {
    id: 1,
    type: StageType.INVITING,
    title: "1단계: 관계 형성 & 문제 정의",
    indicators: ["Indicator 1", "Indicator 2"],
    context: "환자는 진료 시간이 짧아 자신의 상태를 명확히 이해하지 못했습니다. 대화를 시작하고 결정의 주체가 환자임을 명시하세요.",
    patientResponse: "네, 괜찮아요. (간호사의 설명을 듣고 고개를 끄덕임)",
    nurseScript: [
      "OO님, 안녕하세요. 저는 담당 간호사입니다.",
      "앞으로의 치료 방향을 함께 정하는데 도움을 드리려고 찾아뵈었습니다.",
      "오늘 저와 함께 살펴볼 내용은 '현재 의학적으로 가능한 선택지들'과 'OO님께 가장 잘 맞는 방향이 무엇인지'입니다.",
      "이 결정의 최종 주체는 OO님이십니다."
    ],
    options: [
      {
        id: "opt1-1",
        text: "치료 방향 결정을 돕기 위해 왔습니다. 결정의 주체는 환자분임을 명시합니다.",
        guidance: "의사결정의 목적과 환자가 주체임을 명확히 하세요.",
        correct: true
      },
      {
        id: "opt1-2",
        text: "의사 선생님이 결정하신 대로 따르셔야 합니다.",
        guidance: "환자의 자율성을 침해하는 발언입니다.",
        correct: false
      }
    ]
  },
  {
    id: 2,
    type: StageType.EXPLORING,
    title: "2단계: 환자 우려·기대 탐색",
    indicators: ["Indicator 8"],
    context: "환자는 '더 해볼 수 있는 방법'과 '편하게 지내고 싶은 마음' 사이에서 갈등하고 있습니다. 환자의 관점을 탐색하세요.",
    patientResponse: "…더 이상 완치를 기대하기 어렵다 하셔서요. 그래도 뭔가 더 해볼 수 있는 방법이 있는지 계속 고민돼요. (한숨)",
    nurseScript: [
      "최근 교수님 말씀을 들으신 뒤 여러 생각이 드셨을 것 같은데, 어떤 점이 가장 마음에 걸리셨나요?"
    ],
    options: [
      {
        id: "opt2-1",
        text: "교수님 말씀을 듣고 가장 마음에 걸리는 점이 무엇인가요?",
        guidance: "환자의 현재 감정과 우려를 열린 질문으로 탐색하세요.",
        correct: true
      },
      {
        id: "opt2-2",
        text: "걱정하지 마세요. 다 잘 될 겁니다.",
        guidance: "근거 없는 위로는 도움이 되지 않습니다.",
        correct: false
      }
    ]
  },
  {
    id: 3,
    type: StageType.INFORMATION_EXCHANGE,
    title: "3단계: 정보 교환 (Information Exchange)",
    indicators: ["Indicator 1", "Indicator 3", "Indicator 4", "Indicator 5"],
    context: "환자의 양가감정을 읽어주고(Clarifying), 가능한 4가지 옵션의 장단점을 균형 있게 설명하세요(Option-by-option).",
    patientResponse: "아, 그렇게 네 가지나 있군요... 각각 장단점이 뚜렷하네요. (생각에 잠김)",
    nurseScript: [
      "그런 설명을 들으시면 누구라도 놀라실 겁니다. '더 해볼 수 있는 방법'과 '편하게 지내고 싶은 마음'이 함께 있으신 거군요?",
      "가능한 4가지 선택지(유지요법, 임상시험, 완화의료, 경과관찰)에 대해 설명드리겠습니다.",
      "유지요법은 생명 연장 가능성이 있으나 부작용이 따를 수 있고, 완화의료는 증상 조절로 편안함을 드리지만 병의 진행을 막지는 못합니다."
    ],
    options: [
      {
        id: "opt3-1",
        text: "환자의 양가감정을 읽어주고, 4가지 옵션의 개괄과 각각의 장단점(기대효과/위험)을 설명합니다.",
        guidance: "옵션을 나열하고 편향되지 않은 중립적인 정보를 제공하여 환자가 비교할 수 있게 하세요.",
        correct: true
      },
      {
        id: "opt3-2",
        text: "임상시험이 가장 좋은 방법입니다. 새로운 약을 써보시는 게 어떨까요?",
        guidance: "간호사의 주관적 판단으로 특정 옵션을 유도해서는 안 됩니다.",
        correct: false
      }
    ]
  },
  {
    id: 4,
    type: StageType.ELICITING_VALUES,
    title: "4단계: 가치·선호 탐색",
    indicators: ["Indicator 8"],
    context: "정보 제공 후, 환자의 삶에서 무엇이 가장 중요한지 물어보세요.",
    patientResponse: "저는… 너무 아프지만 않았으면 좋겠어요. 그리고 아이들과 시간을 조금이라도 더 보내고 싶어요.",
    nurseScript: [
      "OO님께 가장 중요한 점은 무엇인지 여쭤보고 싶습니다.",
      "통증 최소화, 가족과의 시간, 생명 연장 중 어떤 것이 더 중요하게 느껴지시나요?"
    ],
    options: [
      {
        id: "opt4-1",
        text: "통증 조절, 가족과의 시간, 연명 중 무엇이 가장 중요한지 질문합니다.",
        guidance: "환자의 가치관을 구체적인 예시를 들어 탐색하세요.",
        correct: true
      }
    ]
  },
  {
    id: 5,
    type: StageType.DELIBERATING,
    title: "5단계: 함께 숙고하기",
    indicators: ["Indicator 5"],
    context: "환자의 가치(통증 조절, 가족)와 의학적 옵션을 연결하여 정리합니다.",
    patientResponse: "며칠 생각해보고 싶은데요…",
    nurseScript: [
      "말씀해 주신 가치들을 기준으로 정리하면,",
      "완화의료 중심 접근은 통증을 줄이고 편안한 시간을 보내는 데 초점을 둘 수 있습니다.",
      "오늘 바로 결정하지 않아도 괜찮습니다. 결정 보류도 정당한 선택입니다."
    ],
    options: [
      {
        id: "opt5-1",
        text: "환자의 선호(통증조절/가족)에 부합하는 완화의료의 특징을 연결하고, 결정 보류도 가능함을 알립니다.",
        guidance: "선호 기반의 옵션을 제안하되, 결정을 강요하지 마세요.",
        correct: true
      }
    ]
  },
  {
    id: 6,
    type: StageType.SUPPORTING,
    title: "6단계: 의사결정 지원 및 계획",
    indicators: ["Indicator 9", "Indicator 10", "Indicator 11"],
    context: "환자가 내용을 잘 이해했는지 확인(Teach-back)하고 다음 계획을 수립합니다.",
    patientResponse: "네, 아주 정확하게 이해하고 계십니다. 감사합니다.",
    nurseScript: [
      "제가 설명드린 내용을 이해하신 대로 짧게 말씀해 주실 수 있을까요? (Teach-back)",
      "결정 보류는 언제나 가능합니다.",
      "다음 진료 시 통증 조절 계획 등을 구체적으로 준비해 두겠습니다."
    ],
    options: [
      {
        id: "opt6-1",
        text: "Teach-back으로 이해도를 점검하고, 다음 진료 계획을 안내합니다.",
        guidance: "확인 질문을 통해 오해를 방지하고 안전망을 제공하세요.",
        correct: true
      }
    ]
  }
];