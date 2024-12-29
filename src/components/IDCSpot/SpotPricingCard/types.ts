// 点价卡片状态
export enum SpotPricingCardStatus {
  // 待处理，黄色 header
  ConfirmToBe,
  // 待处理，黄色 header
  SpotterConfirmToBe,
  // 全部已处理，绿色 header
  Confirmed,
  // 全部已拒绝，红色 header
  Refused,
  // 卡片内部分点价完成，紫色header
  PartialFinished,
  // 没有量
  NoVolumn,
  // 线下成交
  Offline
}

// 点价卡片内单条点价的状态
// 由点价卡片的点价方状态、被点价方状态和成交单状态决定
// 点价/被点价方状态则根据GVN还是TKN选择ofr和bid中的一方
export enum SpotPricingCardMessageStatus {
  // 点价方已确认，被点价方待确认，成交单待确认
  // 新创建的点价，全部待处理
  ConfirmToBe,
  // 点价方已确认，被点价方在问，成交单待确认
  // 被点价方点击在问之后产生
  QuoterAsking,
  // 点价方已确认，被点价方已确认，成交单已确认
  // 被点价方确认
  QuoterConfirmed,
  // 点价方已确认，被点价方已拒绝，成交单已拒绝
  // 被点价方拒绝
  QuoterRefused,
  // 点价方待确认，被点价方部分确认，成交单部分确认
  // 被点价方部分确认，待点价方确认
  QuoterPartialConfirmed,
  // 点价方在问，被点价方部分确认，成交单部分确认
  // 被点价方部分确认，点价方拒绝
  SpotterAsking,
  // 点价方已拒绝，被点价方部分确认，成交单已拒绝
  // 被点价方部分确认，点价方拒绝
  SpotterRefused,
  // 点价方已确认，被点价方部分确认，成交单部分确认
  // 被点价方部分确认，点价方确认，成交单变为“部分确认”
  SpotterConfirmed,
  // 没有量
  NoVolumn,
  // 线下成交
  Offline
}
