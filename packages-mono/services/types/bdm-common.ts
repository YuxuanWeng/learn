import {
  AccessType,
  AccountStatus,
  BindStatus,
  DistrictType,
  Enable,
  FlowNodeStatus,
  FlowStatus,
  Gender,
  InstOpField,
  InstStatus,
  JobStatus,
  NodeType,
  OpType,
  Post,
  ProductLock,
  ProductMarkType,
  ProductType,
  RegionLevel,
  SearchDupType,
  Sensitive,
  TagType,
  TraderOpField,
  TraderUsageStatus,
  UsageStatus
} from './enum';

export type Institution = {
  inst_id: string; // 机构id,rules:修改必填
  standard_code: string; // 标准代码,rules:创建必填,max_len=32
  full_name: string; // 标准全名,rules:创建必填,max_len=64
  inst_type: Tag; // 机构类型,rules:创建必填
  inst_level: Tag; // 机构级别,rules:创建必填
  funds_type: Tag; // 资金类型,rules:创建必填
  short_name_zh?: string; // 中文简称,max_len=64
  full_name_zh?: string; // 中文全称,max_len=64
  short_name_en?: string; // 英文简称,max_len=64
  full_name_en?: string; // 英文全称,max_len=64
  address?: string; // 详细地址,max_len=128
  remark?: string; // 备注,max_len=255
  usage_status: UsageStatus; // 使用状态: 根据结束时间判断,rules:创建必填
  biz_short_name_list?: BizShortName[]; // 业务简称
  pin_yin?: string; // 机构拼音,max_len=32
  pin_yin_full?: string; // 机构拼音全称,max_len=255
  area_list?: District[]; // 所有地区的信息
  parent_inst_info?: InstitutionLite; // 上级机构信息
  area?: District; // 城市地区
  product_list?: Product[]; // 产品权限
  inst_status: InstStatus; // 机构状态
  emails?: string[]; // 邮箱
  issuer_code?: string; // 绑定发行人代码
  issuer_name?: string; // 绑定发行人名称
};

export type InstGroup = {
  group_name?: string; // 产品组名称
  product_code_list?: string[]; // 产品权限
};

export type InstitutionLite = {
  inst_id: string; // 机构id
  full_name: string; // 机构全名
  standard_code: string; // 机构标准代码
  short_name_zh?: string; // 中文简称
  full_name_zh?: string; // 中文全称
  short_name_en?: string; // 英文简称
  full_name_en?: string; // 英文全称
  area?: District; // 城市
  inst_type: Tag; // 机构类型
  inst_level: Tag; // 机构级别
  usage_status: UsageStatus; // 使用状态
  product_list?: Product[]; // 产品权限
  inst_status: InstStatus; // 机构状态
  has_access?: boolean; // 是否有权限，true 允许操作 false 不允许操作
  issuer_code?: string; // 绑定的发行人代码
  issuer_rating?: number; // 绑定的发行人主体评级
};

export type InstitutionTiny = {
  inst_id: string; // 机构id
  standard_code: string; // 机构标准代码
  short_name_zh?: string; // 中文简称
  full_name_zh?: string; // 中文全称
  usage_status: UsageStatus; // 使用状态
  biz_short_name_list?: BizShortName[]; // 业务简称
  district_id?: string; // 地域id
  district_name?: string; // 地域名称
};

export type InstTreeNode = {
  inst_id: string; // 机构id
  full_name: string; // 机构全名
  standard_code: string; // 机构标准代码
  short_name_zh: string; // 中文简称
  full_name_zh: string; // 中文全称
  short_name_en: string; // 英文简称
  full_name_en: string; // 英文全称
  start_time: string; // 机构生效时间
  end_time: string; // 机构失效时间
  parent_id: string; // 上级机构id, 根节点该字段为空字符串
};

// 用户信息
export type User = {
  user_id: string; // 用户id
  job_status: JobStatus; // 在职状态：1表示在职，2表示离职
  account_status: AccountStatus; // 账户状态：1表示启用，2表示停用，3表示锁定（账户异常操作导致）
  name_cn: string; // 中文名
  name_en: string; // 英文名
  account: string; // 账户
  email: string; // 邮箱
  phone: string; // 移动电话
  telephone: string; // 座机
  job_num?: string; // 工号
  QQ: string; // qq
  department_id: string; // 部门编号
  deleted: number; // 2为已删除
  department?: Department; // 部门信息
  qm_account: string; // qm账户
  product_list?: Product[]; // 产品权限
  post: Post; // 岗位
  role_list?: Role[];
  access_list?: Access[];
  has_access?: boolean; // 数据权限标识
  pinyin: string; // 拼音
  pinyin_full: string; // 拼音全称
  is_password_reset?: boolean; // 是否重置密码
  access_code_list?: number[]; // 新权限列表
};

export type UserLite = {
  user_id: string;
  job_status: JobStatus; // 在职状态：1表示在职，2表示离职
  account_status: AccountStatus; // 账户状态：1表示启用，2表示停用，3表示锁定（账户异常操作导致）
  name_cn: string; // 中文名
  name_en: string; // 英文名
  account: string; // 账户
  email: string; // 邮箱
  phone: string; // 移动电话
  telephone: string; // 座机
  job_num?: string; // 工号
  QQ: string; // qq
  department_id: string; // 部门编号
  post: Post; // 岗位
};

export type Department = {
  department_id: string; // 部门编号
  name: string; // 部门名
  description?: string; // 部门描述
  code: string; // 部门编号
  parent_id: string; // 上级部门id
  manager_id: string; // 部门主管id
  manager_name: string; // 部门主管
  staff_num: number; // 部门人数
  deleted: number; // 2为已删除
};

export type DepartmentWithChildren = {
  value: Department; // 如果查询时root_dep_id为0，该结构体的值没有意义
  children?: DepartmentWithChildren[];
};

export type Group = {
  group_id: string;
  desc: string;
  list?: AccessV2[];
};

export type Access = {
  access_id: string;
  access_code: string; // 操作权限code
  access_type: AccessType;
  name: string; // 权限节点名称（如“成员详情查询”）
  parent_code: string;
  exclusive_access_list?: string[]; // 互斥权限
  is_leaf?: boolean;
  extra?: string;
};

export type UserAccess = {
  user_id: string;
  access_list?: AccessV2[];
  role_list?: Role[];
};

export type AccessV2 = {
  access_code: number;
  access_type: AccessType;
  name: string;
  parent_code: number;
};

export type AccessBasic = {
  access_id: string;
  access_type: AccessType;
  name: string; // 权限节点名称（如“成员详情查询”）
  parent_id: string;
};

export type Product = {
  product_id: string; // 产品权限ID
  product_code: string; // 产品代码
  product_type: ProductType; // 产品类型枚举
  product_owner_list?: UserLite[]; // 产品负责人
  desc: string; // 产品名称
  display_name: string; // 产品展示名称
  color: string; // 产品颜色
};

export type ProductGroup = {
  group_id: string;
  desc: string;
  product_list?: Product[];
};

export type Trader = {
  trader_id: string; // 交易员id
  name_zh: string; // 中文名
  name_en: string; // 英文名
  gender: Gender; // 性别
  code: string; // 交易员代码
  job_status: JobStatus; // 职位状态
  department: string; // 部门
  position: string; // 岗位
  address: string; // 通讯地址
  emails?: string[]; // 邮件
  phone?: string[]; // 手机
  tel?: string[]; // 固话
  fax?: string[]; // 传真
  qq?: string[]; // qq
  birthday?: string; // 生日
  graduate_school?: string; // 毕业院校
  home_address?: string; // 家庭住址
  hobby?: string; // 兴趣爱好
  broker_list?: User[]; // 绑定该交易员的经纪人列表
  inst_info?: Institution; // 交易员当前所在的机构数据
  start_time?: string; // 交易员和机构绑定的开始时间
  end_time?: string; // 交易员和机构绑定的结束时间
  qm_account?: string; // qm账号
  biz_product_list?: Product[]; // 业务产品权限
  tags?: string[]; // 交易员标签
  product_marks?: ProductMark[]; // 产品标识
  white_list?: TraderWhiteList[]; // 产品的经纪人白名单
  usage_status: TraderUsageStatus; // 交易员使用状态 1启用，2 停用
  product_lock?: ProductLock; // 产品权限锁定
  has_access?: boolean; // 是否有权限，true 允许操作 false 不允许操作
  pinyin?: string; // 拼音
  pinyin_full?: string; // 拼音全称
  default_broker_map: Record<string, string>; // 经纪人首选项映射,key为产品代码，value为经纪人id
};

export type TraderLite = {
  trader_id: string; // 交易员id
  name_zh: string; // 中文名
  name_en: string; // 英文名
  is_vip: boolean; // 是否为 vip
  trader_tag?: string; // 交易员标签
  trader_tag_list?: string[]; // 交易员标签列表
  QQ?: string[]; // QQ
};

export type Tag = {
  tag_id: string; // 标签ID
  type: TagType; // 标签类型
  code: string; // 标签代码
  name: string; // 标签名称
  deleted: number; // 是否已删除，1未删除，2已删除
};

export type TagList = {
  type: TagType;
  tags?: Tag[];
};

export type District = {
  district_id: string; // 地域ID
  code: string; // 地域代码
  name: string; // 地域名称
  level: RegionLevel; // 地域层级，1国家，2省，3市，4区县
  parent_district_id: string; // 父级地域ID
  deleted: number; // 是否已删除，1未删除，2已删除
  is_leaf?: boolean; // 是否叶子节点，前端字段，后端不处理
  full_name: string; // 地区全称，例如中国-北京-朝阳区
  type: DistrictType; // 地区类型，1中国大陆，2其他
  pinyin: string; // 地区类型，1中国大陆，2其他
};

export type DistrictWithChildren = {
  value: District; // 如果查询时root_district_id为0，该结构体的值没有意义
  children?: DistrictWithChildren[];
};

export type InstLiteForPayment = {
  inst_id: string; // 机构id
  standard_code: string; // 机构标准代码
  district: District; // 城市
  swift_code: string; // swift_code
  short_name_zh?: string; // 中文全称
};

export type Approval = {
  approval_id: string; // 抽象流程id（业务id）
  version_no: number; // 抽象流程版本号
  title: string; // 抽象流程名称
  desc: string; // 抽象流程描述
  ccers?: string[]; // 抄送人列表（数组）
  nodes?: ApprovalNode[]; // 抽象流程包含的抽象节点列表(json格式)
};

export type Flow = {
  flow_id: string; // 流程id（业务id）
  approval_id: string; // 所属抽象流程id
  version_no: number; // 所属的抽象流程版本号
  title: string; // 具体流程名称
  desc: string; // 具体流程描述
  curr_nid: string; // 当前执行的具体节点id
  status: FlowStatus; // 根据当前节点是否为终止节点,及其执行情况确定审批流状态,1-进行中,2-通过,3-不通过
  nodes?: FlowNode[]; // 抽象流程包含的抽象节点列表,json格式,不可更改
};

export type ApprovalNode = {
  node_id: string; // 抽象流节点id（业务id）
  approval_id: string; // 所属抽象流id
  node_type: NodeType; // 抽象流节点类型
  title: string; // 抽象流节点名称
  desc: string; // 抽象流节点描述
  approvers?: string[]; // 审批人列表（数组）
};

export type FlowNode = {
  node_id: string; // 具体流节点id（业务id）
  flow_id: string; // 所属具体流程id
  node_type: NodeType; // 具体流节点类型
  title: string; // 具体流程名称
  desc: string; // 具体流程描述
  approvers?: string[]; // 审批人列表（数组）
  status: FlowNodeStatus; // 具体节点审批状态,1-进行中,2-通过,3-不通过
  comment: string; // 节点审批意见
};

export type ApprovalHist = {
  op_time: string; // 操作时间
  operator: string; // 操作人
  op_type: OpType; // 操作类型
  op_value_list?: OpValue[]; // 操作内容
};

export type FlowHist = {
  op_time: string; // 操作时间
  operator: string; // 操作人
  op_type: OpType; // 操作类型
  op_value_list?: OpValue[]; // 操作内容
};

// 为了下面交易员列表功能  暂时定义的两个结构，以后可能需要修改
export type Broker = {
  broker_id: string; // 经纪人id 对应于用户id
  name_zh: string; // 中文名字
  name_en: string; // 英文名字
  email: string; // 邮箱
  department: string; // 机构
  trader_count: number; // 交易员数量
  account: string; // broker 登录账户名
  product_list?: Product[]; // 产品列表
  account_status?: AccountStatus; // 账户状态
  role_list?: Role[]; // 角色列表
};

// 机构交易员绑定关系数据
export type InstTrader = {
  relation_id: string; // 依赖表业务id
  inst_info: InstitutionLite; // 机构数据
  trader_info: TraderLite; // 交易员数据
  start_time: string; // 合作开始时间
  end_time: string; // 合作结束时间
  enable: number; // 有效位标记，1表示可用，2表示不可用
};

// 交易员的机构历史，前端只需要机构名称和合作时间
export type TraderInstHist = {
  relation_id: string; // 交易员和机构的关联id
  inst_id: string; // 机构id
  inst_name: string; // 机构名称
  start_time: string; // 合作开始时间
  end_time: string; // 合作结束时间
};

// 交易员经纪人依赖表
export type TraderBroker = {
  relation_id: string; // 依赖表业务id
  trader_info: TraderLite; // 交易员数据
  broker_info: User; // 经纪人数据
  start_time: string; // 绑定时间
  end_time: string; // 解绑时间
  enable: number; // 有效位标记，1表示可用，2表示不可用
};

export type TraderHist = {
  op_time: string; // 操作时间
  operator: string; // 操作人
  op_type: OpType; // 操作类型
  op_filed: TraderOpField; // 操作域
  op_value_list?: OpValue[]; // 操作内容
  affected_count: number; // 操作影响字段数
  hist_id: string; // 操作历史id
};

export type InstitutionHist = {
  op_time: string; // 操作时间
  operator: string; // 操作人
  op_type: OpType; // 操作类型
  op_filed: InstOpField; // 操作域
  op_value_list?: OpValue[]; // 操作内容
  affected_count: number; // 操作影响字段数
  hist_id: string; // 操作历史id
};

export type OpValue = {
  previous: string; // 先前值
  current: string; // 当前值
  name: string; // 字段实际名称
  field: string; // 字段底层名称
};

export type InstSelect = {
  inst_id: string; // 机构id
  full_name: string; // 机构全名
  short_name_zh: string; // 中文短名
  full_name_zh: string; // 中文全名
  short_name_en: string; // 英文短名
  full_name_en: string; // 英文全名
};

export type BizShortName = {
  name_list?: string[]; // 机构业务简称结构体的列表
  product: Product; // 产品
};

export type ProductBizShortNameInput = {
  biz_short_name_list?: string[]; // 机构业务简称结构体的列表
  product_code: string; // 产品权限代码
};

export type UserProductHist = {
  products?: Product[];
  time: string;
  hist_id: string;
};

export type ProductMark = {
  product: Product;
  marks?: ProductMarkType[];
};

export type TraderWhiteList = {
  product: Product;
  brokers?: User[];
};

export type TraderWhiteListLite = {
  product_code: string;
  broker_ids?: string[];
};

export type UtInst = {
  inst_id: string; // 机构id
  full_name: string; // 机构全名
  short_name_zh: string; // 中文短名
  swift_code?: string; // 银行代码
  area?: District; // 城市地区
};

export type Qm = {
  qm_crm_id: string; // 主键
  qm_id: string; // qm绑定id
  qm_name: string; // qm名称
  qm_org_name?: string; // OrgName
  qm_mobile?: string; // 电话
  is_bind: BindStatus; // 是否绑定 1:绑定 2:未绑定
  display_name?: string; // 显示名称
  bind_count: number; // 绑定次数
};

export type TraderLiteForQm = {
  trader_id: string; // 交易员id
  name_zh: string; // 中文名
  name_en: string; // 英文名
  inst_info?: InstitutionLite; // 机构信息
  bind_time?: string; // 绑定时间
  qm_id?: string; // 绑定的qm_id
};

export type QmTrader = {
  qm: Qm;
  trader_list?: TraderLiteForQm[];
};

export type TraderQm = {
  trader: TraderLiteForQm;
  qm?: Qm;
};

export type TraderSearchDup = {
  type: SearchDupType; // 查询结果类型
  traders?: Trader[]; // 结果对应的交易员信息
};

export type Role = {
  role_id: string; // 流程id（业务id）
  name: string; // 角色名称
  code: string; // 角色代码
  sensitive: Sensitive; // 是否为敏感角色（1表示非敏感角色，2表示敏感角色）
  exclusive_role_list?: RoleBasic[]; // 互斥角色
  desc: string; // 角色描述
  access_list?: AccessV2[]; // 角色拥有的权限列表
  product_type_list?: ProductType[]; // 产品列表
  flag_exclusive?: boolean; // 是否能够互斥
};

export type RoleBasic = {
  role_id: string; // 流程id（业务id）
  name: string; // 角色名称
  code: string; // 角色代码
  sensitive: Sensitive; // 是否为敏感角色（1表示非敏感角色，2表示敏感角色）
  desc: string; // 角色描述
};

export type ProductTimeline = {
  product: Product;
  year: string;
  timelines?: UserProduct[];
  pre_year: string;
  post_year: string;
};

export type UserProduct = {
  relation_id: string;
  user_id: string;
  product_code: string;
  start_time: string;
  end_time: string;
  enable?: Enable;
};

export type BaseResponse = {
  code?: number;
  msg?: string;
  trace_id?: string;
};

export type DefaultResponse = {
  base_response?: BaseResponse;
};

export type InstBasic = {
  short_name_zh: string;
  standard_code: string;
};

export type PayForInst = {
  inst_id: string; // 机构id
  short_name: string; // 机构简称
  product_short_name_set?: BizShortName[]; // 业务简称
  flag_pay_for_inst: boolean; // 是否为代付机构
  update_time?: string;
};

export type PayForInstFee = {
  start: string; // 当前费率所在范围开始时间 x天/x年
  end: string; // 当前费率所在范围开始时间 x天/x年
  fee: number; // 费率
};

export type PayForInstWithFee = {
  inst_id: string; // 机构id
  fee_list?: PayForInstFee[]; // 代付费率
};

export type DuplicateQQMember = {
  post: Post;
  name: string;
  qq: string;
  member_id: string;
};
