export const protoRootJSON = {
  options: {
    go_package: 'v1/bdm/bds/bds_api'
  },
  nested: {
    InstitutionStruct: {
      oneofs: {
        _short_name_zh: {
          oneof: ['short_name_zh']
        },
        _full_name_zh: {
          oneof: ['full_name_zh']
        },
        _short_name_en: {
          oneof: ['short_name_en']
        },
        _full_name_en: {
          oneof: ['full_name_en']
        },
        _address: {
          oneof: ['address']
        },
        _remark: {
          oneof: ['remark']
        },
        _pin_yin: {
          oneof: ['pin_yin']
        },
        _pin_yin_full: {
          oneof: ['pin_yin_full']
        },
        _parent_inst_info: {
          oneof: ['parent_inst_info']
        },
        _area: {
          oneof: ['area']
        },
        _issuer_code: {
          oneof: ['issuer_code']
        },
        _issuer_name: {
          oneof: ['issuer_name']
        }
      },
      fields: {
        inst_id: {
          type: 'string',
          id: 1
        },
        standard_code: {
          type: 'string',
          id: 2
        },
        full_name: {
          type: 'string',
          id: 3
        },
        inst_type: {
          type: 'TagStruct',
          id: 4
        },
        inst_level: {
          type: 'TagStruct',
          id: 5
        },
        funds_type: {
          type: 'TagStruct',
          id: 6
        },
        short_name_zh: {
          type: 'string',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        full_name_zh: {
          type: 'string',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        short_name_en: {
          type: 'string',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        full_name_en: {
          type: 'string',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        address: {
          type: 'string',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        remark: {
          type: 'string',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        usage_status: {
          type: 'UsageStatusEnum',
          id: 13
        },
        biz_short_name_list: {
          rule: 'repeated',
          type: 'BizShortNameStruct',
          id: 14
        },
        pin_yin: {
          type: 'string',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        pin_yin_full: {
          type: 'string',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        area_list: {
          rule: 'repeated',
          type: 'DistrictStruct',
          id: 17
        },
        parent_inst_info: {
          type: 'InstitutionLiteStruct',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        area: {
          type: 'DistrictStruct',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        product_list: {
          rule: 'repeated',
          type: 'ProductStruct',
          id: 20
        },
        inst_status: {
          type: 'InstStatusEnum',
          id: 21
        },
        emails: {
          rule: 'repeated',
          type: 'string',
          id: 22
        },
        issuer_code: {
          type: 'string',
          id: 23,
          options: {
            proto3_optional: true
          }
        },
        issuer_name: {
          type: 'string',
          id: 24,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    InstGroupStruct: {
      oneofs: {
        _group_name: {
          oneof: ['group_name']
        }
      },
      fields: {
        group_name: {
          type: 'string',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        product_code_list: {
          rule: 'repeated',
          type: 'string',
          id: 2
        }
      }
    },
    InstitutionLiteStruct: {
      oneofs: {
        _short_name_zh: {
          oneof: ['short_name_zh']
        },
        _full_name_zh: {
          oneof: ['full_name_zh']
        },
        _short_name_en: {
          oneof: ['short_name_en']
        },
        _full_name_en: {
          oneof: ['full_name_en']
        },
        _area: {
          oneof: ['area']
        },
        _has_access: {
          oneof: ['has_access']
        },
        _issuer_code: {
          oneof: ['issuer_code']
        },
        _issuer_rating: {
          oneof: ['issuer_rating']
        }
      },
      fields: {
        inst_id: {
          type: 'string',
          id: 1
        },
        full_name: {
          type: 'string',
          id: 2
        },
        standard_code: {
          type: 'string',
          id: 3
        },
        short_name_zh: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        full_name_zh: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        short_name_en: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        full_name_en: {
          type: 'string',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        area: {
          type: 'DistrictStruct',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        inst_type: {
          type: 'TagStruct',
          id: 9
        },
        inst_level: {
          type: 'TagStruct',
          id: 10
        },
        usage_status: {
          type: 'UsageStatusEnum',
          id: 11
        },
        product_list: {
          rule: 'repeated',
          type: 'ProductStruct',
          id: 12
        },
        inst_status: {
          type: 'InstStatusEnum',
          id: 13
        },
        has_access: {
          type: 'bool',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        issuer_code: {
          type: 'string',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        issuer_rating: {
          type: 'int32',
          id: 16,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    InstitutionTinyStruct: {
      oneofs: {
        _short_name_zh: {
          oneof: ['short_name_zh']
        },
        _full_name_zh: {
          oneof: ['full_name_zh']
        },
        _district_id: {
          oneof: ['district_id']
        },
        _district_name: {
          oneof: ['district_name']
        }
      },
      fields: {
        inst_id: {
          type: 'string',
          id: 1
        },
        standard_code: {
          type: 'string',
          id: 2
        },
        short_name_zh: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        full_name_zh: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        usage_status: {
          type: 'UsageStatusEnum',
          id: 5
        },
        biz_short_name_list: {
          rule: 'repeated',
          type: 'BizShortNameStruct',
          id: 6
        },
        district_id: {
          type: 'string',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        district_name: {
          type: 'string',
          id: 8,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    InstTreeNodeStruct: {
      fields: {
        inst_id: {
          type: 'string',
          id: 1
        },
        full_name: {
          type: 'string',
          id: 2
        },
        standard_code: {
          type: 'string',
          id: 3
        },
        short_name_zh: {
          type: 'string',
          id: 4
        },
        full_name_zh: {
          type: 'string',
          id: 5
        },
        short_name_en: {
          type: 'string',
          id: 6
        },
        full_name_en: {
          type: 'string',
          id: 7
        },
        start_time: {
          type: 'string',
          id: 8
        },
        end_time: {
          type: 'string',
          id: 9
        },
        parent_id: {
          type: 'string',
          id: 10
        }
      }
    },
    UserStruct: {
      oneofs: {
        _job_num: {
          oneof: ['job_num']
        },
        _department: {
          oneof: ['department']
        },
        _has_access: {
          oneof: ['has_access']
        },
        _is_password_reset: {
          oneof: ['is_password_reset']
        }
      },
      fields: {
        user_id: {
          type: 'string',
          id: 1
        },
        job_status: {
          type: 'JobStatusEnum',
          id: 2
        },
        account_status: {
          type: 'AccountStatusEnum',
          id: 3
        },
        name_cn: {
          type: 'string',
          id: 4
        },
        name_en: {
          type: 'string',
          id: 5
        },
        account: {
          type: 'string',
          id: 6
        },
        email: {
          type: 'string',
          id: 7
        },
        phone: {
          type: 'string',
          id: 8
        },
        telephone: {
          type: 'string',
          id: 9
        },
        job_num: {
          type: 'string',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        QQ: {
          type: 'string',
          id: 11
        },
        department_id: {
          type: 'string',
          id: 12
        },
        deleted: {
          type: 'int32',
          id: 13
        },
        department: {
          type: 'DepartmentStruct',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        qm_account: {
          type: 'string',
          id: 15
        },
        product_list: {
          rule: 'repeated',
          type: 'ProductStruct',
          id: 16
        },
        post: {
          type: 'PostEnum',
          id: 17
        },
        role_list: {
          rule: 'repeated',
          type: 'RoleStruct',
          id: 18
        },
        access_list: {
          rule: 'repeated',
          type: 'AccessStruct',
          id: 19
        },
        has_access: {
          type: 'bool',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        pinyin: {
          type: 'string',
          id: 21
        },
        pinyin_full: {
          type: 'string',
          id: 22
        },
        is_password_reset: {
          type: 'bool',
          id: 23,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    UserLiteStruct: {
      oneofs: {
        _job_num: {
          oneof: ['job_num']
        }
      },
      fields: {
        user_id: {
          type: 'string',
          id: 1
        },
        job_status: {
          type: 'JobStatusEnum',
          id: 2
        },
        account_status: {
          type: 'AccountStatusEnum',
          id: 3
        },
        name_cn: {
          type: 'string',
          id: 4
        },
        name_en: {
          type: 'string',
          id: 5
        },
        account: {
          type: 'string',
          id: 6
        },
        email: {
          type: 'string',
          id: 7
        },
        phone: {
          type: 'string',
          id: 8
        },
        telephone: {
          type: 'string',
          id: 9
        },
        job_num: {
          type: 'string',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        QQ: {
          type: 'string',
          id: 11
        },
        department_id: {
          type: 'string',
          id: 12
        },
        post: {
          type: 'PostEnum',
          id: 13
        }
      }
    },
    DepartmentStruct: {
      oneofs: {
        _description: {
          oneof: ['description']
        }
      },
      fields: {
        department_id: {
          type: 'string',
          id: 1
        },
        name: {
          type: 'string',
          id: 2
        },
        description: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        code: {
          type: 'string',
          id: 4
        },
        parent_id: {
          type: 'string',
          id: 5
        },
        manager_id: {
          type: 'string',
          id: 6
        },
        manager_name: {
          type: 'string',
          id: 7
        },
        staff_num: {
          type: 'int32',
          id: 8
        },
        deleted: {
          type: 'int32',
          id: 9
        }
      }
    },
    DepartmentWithChildrenStruct: {
      fields: {
        value: {
          type: 'DepartmentStruct',
          id: 1
        },
        children: {
          rule: 'repeated',
          type: 'DepartmentWithChildrenStruct',
          id: 2
        }
      }
    },
    GroupStruct: {
      fields: {
        group_id: {
          type: 'string',
          id: 1
        },
        desc: {
          type: 'string',
          id: 2
        },
        list: {
          rule: 'repeated',
          type: 'AccessV2Struct',
          id: 3
        }
      }
    },
    AccessStruct: {
      oneofs: {
        _is_leaf: {
          oneof: ['is_leaf']
        },
        _extra: {
          oneof: ['extra']
        }
      },
      fields: {
        access_id: {
          type: 'string',
          id: 1
        },
        access_code: {
          type: 'string',
          id: 2
        },
        access_type: {
          type: 'AccessTypeEnum',
          id: 3
        },
        name: {
          type: 'string',
          id: 4
        },
        parent_code: {
          type: 'string',
          id: 5
        },
        exclusive_access_list: {
          rule: 'repeated',
          type: 'string',
          id: 6
        },
        is_leaf: {
          type: 'bool',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        extra: {
          type: 'string',
          id: 8,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    UserAccessStruct: {
      fields: {
        user_id: {
          type: 'string',
          id: 1
        },
        access_list: {
          rule: 'repeated',
          type: 'AccessV2Struct',
          id: 2
        },
        role_list: {
          rule: 'repeated',
          type: 'RoleStruct',
          id: 3
        }
      }
    },
    AccessV2Struct: {
      fields: {
        access_code: {
          type: 'int32',
          id: 1
        },
        access_type: {
          type: 'AccessTypeEnum',
          id: 3
        },
        name: {
          type: 'string',
          id: 4
        },
        parent_code: {
          type: 'int32',
          id: 5
        }
      }
    },
    AccessBasicStruct: {
      fields: {
        access_id: {
          type: 'string',
          id: 1
        },
        access_type: {
          type: 'AccessTypeEnum',
          id: 2
        },
        name: {
          type: 'string',
          id: 3
        },
        parent_id: {
          type: 'string',
          id: 4
        }
      }
    },
    ProductStruct: {
      fields: {
        product_id: {
          type: 'string',
          id: 1
        },
        product_code: {
          type: 'string',
          id: 2
        },
        product_type: {
          type: 'ProductTypeEnum',
          id: 3
        },
        product_owner_list: {
          rule: 'repeated',
          type: 'UserLiteStruct',
          id: 4
        },
        desc: {
          type: 'string',
          id: 5
        },
        display_name: {
          type: 'string',
          id: 6
        },
        color: {
          type: 'string',
          id: 7
        }
      }
    },
    ProductGroupStruct: {
      fields: {
        group_id: {
          type: 'string',
          id: 1
        },
        desc: {
          type: 'string',
          id: 2
        },
        product_list: {
          rule: 'repeated',
          type: 'ProductStruct',
          id: 3
        }
      }
    },
    TraderStruct: {
      oneofs: {
        _birthday: {
          oneof: ['birthday']
        },
        _graduate_school: {
          oneof: ['graduate_school']
        },
        _home_address: {
          oneof: ['home_address']
        },
        _hobby: {
          oneof: ['hobby']
        },
        _inst_info: {
          oneof: ['inst_info']
        },
        _start_time: {
          oneof: ['start_time']
        },
        _end_time: {
          oneof: ['end_time']
        },
        _qm_account: {
          oneof: ['qm_account']
        },
        _product_lock: {
          oneof: ['product_lock']
        },
        _has_access: {
          oneof: ['has_access']
        },
        _pinyin: {
          oneof: ['pinyin']
        },
        _pinyin_full: {
          oneof: ['pinyin_full']
        }
      },
      fields: {
        trader_id: {
          type: 'string',
          id: 1
        },
        name_zh: {
          type: 'string',
          id: 2
        },
        name_en: {
          type: 'string',
          id: 3
        },
        gender: {
          type: 'GenderEnum',
          id: 4
        },
        code: {
          type: 'string',
          id: 5
        },
        job_status: {
          type: 'JobStatusEnum',
          id: 6
        },
        department: {
          type: 'string',
          id: 7
        },
        position: {
          type: 'string',
          id: 8
        },
        address: {
          type: 'string',
          id: 9
        },
        emails: {
          rule: 'repeated',
          type: 'string',
          id: 10
        },
        phone: {
          rule: 'repeated',
          type: 'string',
          id: 11
        },
        tel: {
          rule: 'repeated',
          type: 'string',
          id: 12
        },
        fax: {
          rule: 'repeated',
          type: 'string',
          id: 13
        },
        qq: {
          rule: 'repeated',
          type: 'string',
          id: 14
        },
        birthday: {
          type: 'string',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        graduate_school: {
          type: 'string',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        home_address: {
          type: 'string',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        hobby: {
          type: 'string',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        broker_list: {
          rule: 'repeated',
          type: 'UserStruct',
          id: 19
        },
        inst_info: {
          type: 'InstitutionStruct',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        start_time: {
          type: 'string',
          id: 21,
          options: {
            proto3_optional: true
          }
        },
        end_time: {
          type: 'string',
          id: 22,
          options: {
            proto3_optional: true
          }
        },
        qm_account: {
          type: 'string',
          id: 23,
          options: {
            proto3_optional: true
          }
        },
        biz_product_list: {
          rule: 'repeated',
          type: 'ProductStruct',
          id: 24
        },
        tags: {
          rule: 'repeated',
          type: 'string',
          id: 25
        },
        product_marks: {
          rule: 'repeated',
          type: 'ProductMarkStruct',
          id: 26
        },
        white_list: {
          rule: 'repeated',
          type: 'TraderWhiteListStruct',
          id: 27
        },
        usage_status: {
          type: 'TraderUsageStatusEnum',
          id: 28
        },
        product_lock: {
          type: 'ProductLockEnum',
          id: 29,
          options: {
            proto3_optional: true
          }
        },
        has_access: {
          type: 'bool',
          id: 30,
          options: {
            proto3_optional: true
          }
        },
        pinyin: {
          type: 'string',
          id: 31,
          options: {
            proto3_optional: true
          }
        },
        pinyin_full: {
          type: 'string',
          id: 32,
          options: {
            proto3_optional: true
          }
        },
        default_broker_map: {
          keyType: 'string',
          type: 'string',
          id: 33
        }
      }
    },
    TraderLiteStruct: {
      oneofs: {
        _trader_tag: {
          oneof: ['trader_tag']
        }
      },
      fields: {
        trader_id: {
          type: 'string',
          id: 1
        },
        name_zh: {
          type: 'string',
          id: 2
        },
        name_en: {
          type: 'string',
          id: 3
        },
        is_vip: {
          type: 'bool',
          id: 4
        },
        trader_tag: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        trader_tag_list: {
          rule: 'repeated',
          type: 'string',
          id: 6
        },
        QQ: {
          rule: 'repeated',
          type: 'string',
          id: 7
        }
      }
    },
    TagStruct: {
      fields: {
        tag_id: {
          type: 'string',
          id: 1
        },
        type: {
          type: 'TagTypeEnum',
          id: 2
        },
        code: {
          type: 'string',
          id: 3
        },
        name: {
          type: 'string',
          id: 4
        },
        deleted: {
          type: 'int32',
          id: 5
        }
      }
    },
    TagListStruct: {
      fields: {
        type: {
          type: 'TagTypeEnum',
          id: 1
        },
        tags: {
          rule: 'repeated',
          type: 'TagStruct',
          id: 2
        }
      }
    },
    DistrictStruct: {
      oneofs: {
        _is_leaf: {
          oneof: ['is_leaf']
        }
      },
      fields: {
        district_id: {
          type: 'string',
          id: 1
        },
        code: {
          type: 'string',
          id: 2
        },
        name: {
          type: 'string',
          id: 3
        },
        level: {
          type: 'RegionLevelEnum',
          id: 4
        },
        parent_district_id: {
          type: 'string',
          id: 5
        },
        deleted: {
          type: 'int32',
          id: 6
        },
        is_leaf: {
          type: 'bool',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        full_name: {
          type: 'string',
          id: 8
        },
        type: {
          type: 'DistrictTypeEnum',
          id: 9
        },
        pinyin: {
          type: 'string',
          id: 10
        }
      }
    },
    DistrictWithChildrenStruct: {
      fields: {
        value: {
          type: 'DistrictStruct',
          id: 1
        },
        children: {
          rule: 'repeated',
          type: 'DistrictWithChildrenStruct',
          id: 2
        }
      }
    },
    InstLiteForPaymentStruct: {
      oneofs: {
        _short_name_zh: {
          oneof: ['short_name_zh']
        }
      },
      fields: {
        inst_id: {
          type: 'string',
          id: 1
        },
        standard_code: {
          type: 'string',
          id: 2
        },
        district: {
          type: 'DistrictStruct',
          id: 3
        },
        swift_code: {
          type: 'string',
          id: 4
        },
        short_name_zh: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    ApprovalStruct: {
      fields: {
        approval_id: {
          type: 'string',
          id: 1
        },
        version_no: {
          type: 'int32',
          id: 2
        },
        title: {
          type: 'string',
          id: 3
        },
        desc: {
          type: 'string',
          id: 4
        },
        ccers: {
          rule: 'repeated',
          type: 'string',
          id: 5
        },
        nodes: {
          rule: 'repeated',
          type: 'ApprovalNodeStruct',
          id: 6
        }
      }
    },
    FlowStruct: {
      fields: {
        flow_id: {
          type: 'string',
          id: 1
        },
        approval_id: {
          type: 'string',
          id: 2
        },
        version_no: {
          type: 'int32',
          id: 3
        },
        title: {
          type: 'string',
          id: 4
        },
        desc: {
          type: 'string',
          id: 5
        },
        curr_nid: {
          type: 'string',
          id: 6
        },
        status: {
          type: 'FlowStatusEnum',
          id: 7
        },
        nodes: {
          rule: 'repeated',
          type: 'FlowNodeStruct',
          id: 8
        }
      }
    },
    ApprovalNodeStruct: {
      fields: {
        node_id: {
          type: 'string',
          id: 1
        },
        approval_id: {
          type: 'string',
          id: 2
        },
        node_type: {
          type: 'NodeTypeEnum',
          id: 3
        },
        title: {
          type: 'string',
          id: 4
        },
        desc: {
          type: 'string',
          id: 5
        },
        approvers: {
          rule: 'repeated',
          type: 'string',
          id: 6
        }
      }
    },
    FlowNodeStruct: {
      fields: {
        node_id: {
          type: 'string',
          id: 1
        },
        flow_id: {
          type: 'string',
          id: 2
        },
        node_type: {
          type: 'NodeTypeEnum',
          id: 3
        },
        title: {
          type: 'string',
          id: 4
        },
        desc: {
          type: 'string',
          id: 5
        },
        approvers: {
          rule: 'repeated',
          type: 'string',
          id: 6
        },
        status: {
          type: 'FlowNodeStatusEnum',
          id: 7
        },
        comment: {
          type: 'string',
          id: 8
        }
      }
    },
    ApprovalHistStruct: {
      fields: {
        op_time: {
          type: 'string',
          id: 1
        },
        operator: {
          type: 'string',
          id: 2
        },
        op_type: {
          type: 'OpTypeEnum',
          id: 3
        },
        op_value_list: {
          rule: 'repeated',
          type: 'OpValueStruct',
          id: 4
        }
      }
    },
    FlowHistStruct: {
      fields: {
        op_time: {
          type: 'string',
          id: 1
        },
        operator: {
          type: 'string',
          id: 2
        },
        op_type: {
          type: 'OpTypeEnum',
          id: 3
        },
        op_value_list: {
          rule: 'repeated',
          type: 'OpValueStruct',
          id: 4
        }
      }
    },
    BrokerStruct: {
      oneofs: {
        _account_status: {
          oneof: ['account_status']
        }
      },
      fields: {
        broker_id: {
          type: 'string',
          id: 1
        },
        name_zh: {
          type: 'string',
          id: 2
        },
        name_en: {
          type: 'string',
          id: 3
        },
        email: {
          type: 'string',
          id: 4
        },
        department: {
          type: 'string',
          id: 5
        },
        trader_count: {
          type: 'int32',
          id: 6
        },
        account: {
          type: 'string',
          id: 8
        },
        product_list: {
          rule: 'repeated',
          type: 'ProductStruct',
          id: 9
        },
        account_status: {
          type: 'AccountStatusEnum',
          id: 10,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    InstTraderStruct: {
      fields: {
        relation_id: {
          type: 'string',
          id: 1
        },
        inst_info: {
          type: 'InstitutionLiteStruct',
          id: 2
        },
        trader_info: {
          type: 'TraderLiteStruct',
          id: 3
        },
        start_time: {
          type: 'string',
          id: 4
        },
        end_time: {
          type: 'string',
          id: 5
        },
        enable: {
          type: 'int32',
          id: 6
        }
      }
    },
    TraderInstHistStruct: {
      fields: {
        relation_id: {
          type: 'string',
          id: 1
        },
        inst_id: {
          type: 'string',
          id: 2
        },
        inst_name: {
          type: 'string',
          id: 3
        },
        start_time: {
          type: 'string',
          id: 4
        },
        end_time: {
          type: 'string',
          id: 5
        }
      }
    },
    TraderBrokerStruct: {
      fields: {
        relation_id: {
          type: 'string',
          id: 1
        },
        trader_info: {
          type: 'TraderLiteStruct',
          id: 2
        },
        broker_info: {
          type: 'UserStruct',
          id: 3
        },
        start_time: {
          type: 'string',
          id: 4
        },
        end_time: {
          type: 'string',
          id: 5
        },
        enable: {
          type: 'int32',
          id: 6
        }
      }
    },
    TraderHistStruct: {
      fields: {
        op_time: {
          type: 'string',
          id: 1
        },
        operator: {
          type: 'string',
          id: 2
        },
        op_type: {
          type: 'OpTypeEnum',
          id: 3
        },
        op_filed: {
          type: 'TraderOpFieldEnum',
          id: 4
        },
        op_value_list: {
          rule: 'repeated',
          type: 'OpValueStruct',
          id: 5
        },
        affected_count: {
          type: 'int32',
          id: 6
        },
        hist_id: {
          type: 'string',
          id: 7
        }
      }
    },
    InstitutionHistStruct: {
      fields: {
        op_time: {
          type: 'string',
          id: 1
        },
        operator: {
          type: 'string',
          id: 2
        },
        op_type: {
          type: 'OpTypeEnum',
          id: 3
        },
        op_filed: {
          type: 'InstOpFieldEnum',
          id: 4
        },
        op_value_list: {
          rule: 'repeated',
          type: 'OpValueStruct',
          id: 5
        },
        affected_count: {
          type: 'int32',
          id: 6
        },
        hist_id: {
          type: 'string',
          id: 7
        }
      }
    },
    OpValueStruct: {
      fields: {
        previous: {
          type: 'string',
          id: 1
        },
        current: {
          type: 'string',
          id: 2
        },
        name: {
          type: 'string',
          id: 3
        },
        field: {
          type: 'string',
          id: 4
        }
      }
    },
    InstSelectStruct: {
      fields: {
        inst_id: {
          type: 'string',
          id: 1
        },
        full_name: {
          type: 'string',
          id: 2
        },
        short_name_zh: {
          type: 'string',
          id: 3
        },
        full_name_zh: {
          type: 'string',
          id: 4
        },
        short_name_en: {
          type: 'string',
          id: 5
        },
        full_name_en: {
          type: 'string',
          id: 6
        }
      }
    },
    BizShortNameStruct: {
      fields: {
        name_list: {
          rule: 'repeated',
          type: 'string',
          id: 1
        },
        product: {
          type: 'ProductStruct',
          id: 2
        }
      }
    },
    ProductBizShortNameInputStruct: {
      fields: {
        biz_short_name_list: {
          rule: 'repeated',
          type: 'string',
          id: 1
        },
        product_code: {
          type: 'string',
          id: 2
        }
      }
    },
    UserProductHistStruct: {
      fields: {
        products: {
          rule: 'repeated',
          type: 'ProductStruct',
          id: 1
        },
        time: {
          type: 'string',
          id: 2
        },
        hist_id: {
          type: 'string',
          id: 3
        }
      }
    },
    ProductMarkStruct: {
      fields: {
        product: {
          type: 'ProductStruct',
          id: 1
        },
        marks: {
          rule: 'repeated',
          type: 'ProductMarkTypeEnum',
          id: 2
        }
      }
    },
    TraderWhiteListStruct: {
      fields: {
        product: {
          type: 'ProductStruct',
          id: 1
        },
        brokers: {
          rule: 'repeated',
          type: 'UserStruct',
          id: 2
        }
      }
    },
    TraderWhiteListLiteStruct: {
      fields: {
        product_code: {
          type: 'string',
          id: 1
        },
        broker_ids: {
          rule: 'repeated',
          type: 'string',
          id: 2
        }
      }
    },
    UtInstStruct: {
      oneofs: {
        _swift_code: {
          oneof: ['swift_code']
        },
        _area: {
          oneof: ['area']
        }
      },
      fields: {
        inst_id: {
          type: 'string',
          id: 1
        },
        full_name: {
          type: 'string',
          id: 2
        },
        short_name_zh: {
          type: 'string',
          id: 3
        },
        swift_code: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        area: {
          type: 'DistrictStruct',
          id: 5,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    QmStruct: {
      oneofs: {
        _qm_org_name: {
          oneof: ['qm_org_name']
        },
        _qm_mobile: {
          oneof: ['qm_mobile']
        },
        _display_name: {
          oneof: ['display_name']
        }
      },
      fields: {
        qm_crm_id: {
          type: 'string',
          id: 1
        },
        qm_id: {
          type: 'string',
          id: 2
        },
        qm_name: {
          type: 'string',
          id: 3
        },
        qm_org_name: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        qm_mobile: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        is_bind: {
          type: 'BindStatusEnum',
          id: 6
        },
        display_name: {
          type: 'string',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        bind_count: {
          type: 'int32',
          id: 8
        }
      }
    },
    TraderLiteForQmStruct: {
      oneofs: {
        _inst_info: {
          oneof: ['inst_info']
        },
        _bind_time: {
          oneof: ['bind_time']
        },
        _qm_id: {
          oneof: ['qm_id']
        }
      },
      fields: {
        trader_id: {
          type: 'string',
          id: 1
        },
        name_zh: {
          type: 'string',
          id: 2
        },
        name_en: {
          type: 'string',
          id: 3
        },
        inst_info: {
          type: 'InstitutionLiteStruct',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        bind_time: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        qm_id: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    QmTraderStruct: {
      fields: {
        qm: {
          type: 'QmStruct',
          id: 1
        },
        trader_list: {
          rule: 'repeated',
          type: 'TraderLiteForQmStruct',
          id: 2
        }
      }
    },
    TraderQmStruct: {
      oneofs: {
        _qm: {
          oneof: ['qm']
        }
      },
      fields: {
        trader: {
          type: 'TraderLiteForQmStruct',
          id: 1
        },
        qm: {
          type: 'QmStruct',
          id: 2,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    TraderSearchDupStruct: {
      fields: {
        type: {
          type: 'SearchDupTypeEnum',
          id: 1
        },
        traders: {
          rule: 'repeated',
          type: 'TraderStruct',
          id: 2
        }
      }
    },
    RoleStruct: {
      fields: {
        role_id: {
          type: 'string',
          id: 1
        },
        name: {
          type: 'string',
          id: 2
        },
        code: {
          type: 'string',
          id: 3
        },
        sensitive: {
          type: 'SensitiveEnum',
          id: 4
        },
        exclusive_role_list: {
          rule: 'repeated',
          type: 'RoleBasicStruct',
          id: 5
        },
        desc: {
          type: 'string',
          id: 6
        },
        access_list: {
          rule: 'repeated',
          type: 'AccessV2Struct',
          id: 7
        }
      }
    },
    RoleBasicStruct: {
      fields: {
        role_id: {
          type: 'string',
          id: 1
        },
        name: {
          type: 'string',
          id: 2
        },
        code: {
          type: 'string',
          id: 3
        },
        sensitive: {
          type: 'SensitiveEnum',
          id: 4
        },
        desc: {
          type: 'string',
          id: 5
        }
      }
    },
    ProductTimelineStruct: {
      fields: {
        product: {
          type: 'ProductStruct',
          id: 1
        },
        year: {
          type: 'string',
          id: 2
        },
        timelines: {
          rule: 'repeated',
          type: 'UserProductStruct',
          id: 3
        },
        pre_year: {
          type: 'string',
          id: 4
        },
        post_year: {
          type: 'string',
          id: 5
        }
      }
    },
    UserProductStruct: {
      oneofs: {
        _enable: {
          oneof: ['enable']
        }
      },
      fields: {
        relation_id: {
          type: 'string',
          id: 1
        },
        user_id: {
          type: 'string',
          id: 2
        },
        product_code: {
          type: 'string',
          id: 3
        },
        start_time: {
          type: 'string',
          id: 4
        },
        end_time: {
          type: 'string',
          id: 5
        },
        enable: {
          type: 'EnableEnum',
          id: 6,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    BaseResponseStruct: {
      oneofs: {
        _code: {
          oneof: ['code']
        },
        _msg: {
          oneof: ['msg']
        },
        _trace_id: {
          oneof: ['trace_id']
        }
      },
      fields: {
        code: {
          type: 'int32',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        msg: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        trace_id: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    DefaultResponseStruct: {
      oneofs: {
        _base_response: {
          oneof: ['base_response']
        }
      },
      fields: {
        base_response: {
          type: 'BaseResponseStruct',
          id: 1,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    InstBasicStruct: {
      fields: {
        short_name_zh: {
          type: 'string',
          id: 1
        },
        standard_code: {
          type: 'string',
          id: 2
        }
      }
    },
    PayForInstStruct: {
      oneofs: {
        _update_time: {
          oneof: ['update_time']
        }
      },
      fields: {
        inst_id: {
          type: 'string',
          id: 1
        },
        short_name: {
          type: 'string',
          id: 2
        },
        product_short_name_set: {
          rule: 'repeated',
          type: 'BizShortNameStruct',
          id: 3
        },
        flag_pay_for_inst: {
          type: 'bool',
          id: 4
        },
        update_time: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    PayForInstFeeStruct: {
      fields: {
        start: {
          type: 'string',
          id: 1
        },
        end: {
          type: 'string',
          id: 2
        },
        fee: {
          type: 'double',
          id: 3
        }
      }
    },
    PayForInstWithFeeStruct: {
      fields: {
        inst_id: {
          type: 'string',
          id: 1
        },
        fee_list: {
          rule: 'repeated',
          type: 'PayForInstFeeStruct',
          id: 2
        }
      }
    },
    DuplicateQQMemberStruct: {
      fields: {
        post: {
          type: 'PostEnum',
          id: 1
        },
        name: {
          type: 'string',
          id: 2
        },
        qq: {
          type: 'string',
          id: 3
        },
        member_id: {
          type: 'string',
          id: 4
        }
      }
    },
    AccessTypeEnum: {
      values: {
        AccessTypeNone: 0,
        System: 1,
        Module: 2,
        Menu: 3,
        Page: 4,
        Tab: 5,
        Data: 6,
        Operation: 7
      }
    },
    AccessBizTypeEnum: {
      values: {
        AccessBizTypeNone: 0,
        CustomerManage: 1,
        CRMAdmin: 2
      }
    },
    ProductAuthTargetTypeEnum: {
      values: {
        ProductAuthTargetTypeNone: 0,
        Inst: 1,
        Trader: 2,
        User: 3
      }
    },
    UsageStatusEnum: {
      values: {
        UsageStatusNone: 0,
        Using: 1,
        Deactivate: 2
      }
    },
    TraderUsageStatusEnum: {
      values: {
        TraderUsageStatusNone: 0,
        TraderEnable: 1,
        TraderDisable: 2
      }
    },
    CreateTypeEnum: {
      values: {
        CreateTypeNone: 0,
        KYC: 1,
        CRM: 2
      }
    },
    GenderEnum: {
      values: {
        GenderNone: 0,
        Man: 1,
        Woman: 2
      }
    },
    JobStatusEnum: {
      values: {
        JobStatusNone: 0,
        OnJob: 1,
        Quit: 2
      }
    },
    AccountStatusEnum: {
      values: {
        AccountStatusNone: 0,
        Enable: 1,
        Disable: 2,
        Locked: 3
      }
    },
    TagTypeEnum: {
      values: {
        TagTypeNone: 0,
        InstType: 1,
        InstLevel: 2,
        InstFondType: 3,
        TraderTag: 4,
        StockType: 5,
        ControllerType: 6,
        Currency: 7
      }
    },
    DistrictTypeEnum: {
      values: {
        DistrictTypeNone: 0,
        CN: 1,
        OTHER: 2
      }
    },
    FlowStatusEnum: {
      values: {
        FlowStatusNone: 0,
        UnderApproval: 1,
        Passed: 2,
        Failed: 3
      }
    },
    FlowNodeStatusEnum: {
      values: {
        NodeStatusNone: 0,
        NodeUnderApproval: 1,
        NodePassed: 2,
        NodeFailed: 3
      }
    },
    ApproverStatusEnum: {
      values: {
        ApproverStatusNone: 0,
        ApproverWaiting: 1,
        ApproverPassed: 2,
        ApproverFailed: 3,
        ApproverMissed: 4
      }
    },
    NodeTypeEnum: {
      values: {
        NodeTypeNone: 0,
        Head: 1,
        Inner: 2,
        Tail: 3
      }
    },
    OpTypeEnum: {
      values: {
        OpTypeNone: 0,
        Create: 1,
        Modify: 2,
        OpEnable: 3,
        OpDisable: 4
      }
    },
    TraderOpFieldEnum: {
      values: {
        TraderOpFieldNone: 0,
        TraderBasicInfo: 1,
        CareerPath: 2
      }
    },
    InstOpFieldEnum: {
      values: {
        InstOpFieldNone: 0,
        InstBasicInfo: 1,
        PaymentCreate: 2,
        PaymentModify: 3,
        PaymentDelete: 4,
        SettleFileAdd: 5,
        SettleFileRemove: 6
      }
    },
    KYCStatusEnum: {
      values: {
        KYCStatusNone: 0,
        NotChecked: 1,
        Pass: 2,
        Ignore: 3
      }
    },
    SearchTypeEnum: {
      values: {
        SearchTypeNone: 0,
        AllSearch: 1,
        InstSearch: 2,
        UserSearch: 3,
        TraderSearch: 4
      }
    },
    ProductTypeEnum: {
      values: {
        ProductTypeNone: 0,
        FXO: 1,
        FX: 2,
        ABS: 3,
        IRS: 4,
        BCO: 5,
        BNC: 6,
        NCD: 7,
        FXBOND: 8,
        GOLD: 9,
        PC: 10,
        MM: 11,
        MMCD: 12,
        BILL: 13,
        MMOFF1: 14,
        MMOFF2: 15,
        ABSP: 16,
        HYB: 17,
        ABH: 18,
        SLD: 19,
        NCDP: 20
      }
    },
    SyncDataTypeEnum: {
      values: {
        SyncDataTypeNone: 0,
        SyncDataTypeQuote: 1,
        SyncDataTypeDeal: 2,
        SyncDataTypeTrader: 3,
        SyncDataTypeInst: 4,
        SyncDataTypeUser: 5,
        SyncDataTypeBondBasic: 6,
        SyncDataTypeQuoteDraft: 7,
        SyncDataTypeHoliday: 8,
        SyncDataTypeBondAppendix: 9,
        SyncDataTypeQuoteDraftMessage: 10,
        SyncDataTypeBondDetail: 11,
        SyncDataTypeQuoteDetail: 12,
        SyncDataTypeDealRecord: 13,
        SyncDataTypeIssuerInst: 14
      }
    },
    PostEnum: {
      values: {
        PostNone: 0,
        Post_Broker: 1,
        Post_BrokerAssistant: 2,
        Post_BrokerTrainee: 3,
        Post_DI: 4,
        Post_Backstage: 5,
        Post_Trader: 6
      }
    },
    AccountTypeEnum: {
      values: {
        AccountInfoNone: 0,
        Account: 1,
        Chip: 2,
        None: 3
      }
    },
    SearchInstMatchFieldEnum: {
      values: {
        SearchInstMatchFieldNone: 0,
        PinYin: 1,
        PinYinFull: 2,
        ShortNameZh: 3,
        StandardCode: 4,
        FullNameZh: 5
      }
    },
    ProductMarkTypeEnum: {
      values: {
        ProductMarkNone: 0,
        VIP: 1,
        Lead: 2
      }
    },
    BindStatusEnum: {
      values: {
        BindStatusNone: 0,
        Binded: 1,
        Unbound: 2
      }
    },
    BindOperationEnum: {
      values: {
        BindOperationNone: 0,
        Bind: 1,
        UnBind: 2
      }
    },
    LegalPersonEnum: {
      values: {
        LegalPersonNone: 0,
        LegalPerson: 1,
        NotLegalPerson: 2
      }
    },
    BindMbsEnum: {
      values: {
        BindMbsNone: 0,
        BindMbs: 1,
        NotBind: 2
      }
    },
    InstStatusEnum: {
      values: {
        InstStatusNone: 0,
        StartBiz: 1,
        StopBiz: 2
      }
    },
    EnableEnum: {
      values: {
        EnableNone: 0,
        DataEnable: 1,
        DataDisable: 2
      }
    },
    SearchDupTypeEnum: {
      values: {
        SearchDupTypeNone: 0,
        SameInstAndName: 1,
        SameInstAndInitial: 2,
        SameNameOnly: 3
      }
    },
    RegionLevelEnum: {
      values: {
        RegionLevelNone: 0,
        Country: 1,
        Province: 2,
        City: 3,
        District: 4,
        OtherRegionLevel: 5
      }
    },
    AreaLevelEnum: {
      values: {
        AreaLevelNone: 0,
        PRN: 1,
        CTY: 2,
        TWN: 3,
        OTH: 4,
        ARE: 5,
        IND: 6,
        VIL: 7
      }
    },
    ProductLockEnum: {
      values: {
        ProductLockEnumNone: 0,
        Lock: 1,
        Unlock: 2
      }
    },
    SortEnum: {
      values: {
        SortEnumNone: 0,
        ASC: 1,
        DESC: 2
      }
    },
    SensitiveEnum: {
      values: {
        SensitiveEnumNone: 0,
        Sensitive: 1,
        NonSensitive: 2
      }
    },
    AliyunTokenTypeEnum: {
      values: {
        BizTypeNone: 0,
        BizTypeTTS: 1
      }
    },
    MsgSendSceneEnum: {
      values: {
        MsgSendSceneNone: 0,
        RemindOrder: 1,
        DealDetailSend: 2,
        DealRecordSend: 3,
        SpotPricingSend: 4
      }
    },
    UserTypeEnum: {
      values: {
        UserTypeNone: 0,
        UserTypeBroker: 1,
        UserTypeTrader: 2
      }
    },
    ImMsgSendStatusEnum: {
      values: {
        ImMsgSendStatusNone: 0,
        SendSuccess: 1,
        SendFailed: 2
      }
    },
    QuoteFilterGroupStruct: {
      fields: {
        group_id: {
          type: 'string',
          id: 1
        },
        product_type: {
          type: 'ProductTypeEnum',
          id: 2
        },
        group_name: {
          type: 'string',
          id: 3
        },
        creator_id: {
          type: 'string',
          id: 4
        },
        creator_name: {
          type: 'string',
          id: 5
        },
        desc: {
          type: 'string',
          id: 6
        },
        shared_broker_list: {
          rule: 'repeated',
          type: 'BrokerStruct',
          id: 7
        },
        watching_broker_list: {
          rule: 'repeated',
          type: 'BrokerStruct',
          id: 8
        }
      }
    },
    UpdatedQuoteFilterGroupStruct: {
      oneofs: {
        _group_id: {
          oneof: ['group_id']
        },
        _product_type: {
          oneof: ['product_type']
        },
        _group_name: {
          oneof: ['group_name']
        },
        _creator_name: {
          oneof: ['creator_name']
        },
        _desc: {
          oneof: ['desc']
        }
      },
      fields: {
        group_id: {
          type: 'string',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        product_type: {
          type: 'ProductTypeEnum',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        group_name: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        creator_name: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        desc: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        shared_broker_id_list: {
          rule: 'repeated',
          type: 'string',
          id: 6
        },
        watching_broker_id_list: {
          rule: 'repeated',
          type: 'string',
          id: 7
        }
      }
    },
    RangeDoubleStruct: {
      oneofs: {
        _min: {
          oneof: ['min']
        },
        _max: {
          oneof: ['max']
        }
      },
      fields: {
        min: {
          type: 'double',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        max: {
          type: 'double',
          id: 2,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    RangeIntegerStruct: {
      oneofs: {
        _min: {
          oneof: ['min']
        },
        _max: {
          oneof: ['max']
        }
      },
      fields: {
        min: {
          type: 'int32',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        max: {
          type: 'int32',
          id: 2,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    RangeTimeStruct: {
      oneofs: {
        _start_time: {
          oneof: ['start_time']
        },
        _end_time: {
          oneof: ['end_time']
        }
      },
      fields: {
        start_time: {
          type: 'string',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        end_time: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    QuickFilter: {
      oneofs: {
        _yield: {
          oneof: ['yield']
        },
        _new_listed: {
          oneof: ['new_listed']
        },
        _offset: {
          oneof: ['offset']
        },
        _val_modified_duration: {
          oneof: ['val_modified_duration']
        },
        _is_mortgage: {
          oneof: ['is_mortgage']
        },
        _is_cross_mkt: {
          oneof: ['is_cross_mkt']
        },
        _unquoted: {
          oneof: ['unquoted']
        },
        _consideration: {
          oneof: ['consideration']
        },
        _is_yield: {
          oneof: ['is_yield']
        },
        _is_offset: {
          oneof: ['is_offset']
        },
        _is_duration: {
          oneof: ['is_duration']
        },
        _is_consideration: {
          oneof: ['is_consideration']
        },
        _is_coupon_rate: {
          oneof: ['is_coupon_rate']
        },
        _coupon_rate: {
          oneof: ['coupon_rate']
        }
      },
      fields: {
        intelligence_sorting: {
          type: 'bool',
          id: 1
        },
        yield: {
          type: 'RangeDoubleStruct',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        new_listed: {
          type: 'bool',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        offset: {
          type: 'RangeDoubleStruct',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        val_modified_duration: {
          type: 'RangeDoubleStruct',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        is_mortgage: {
          type: 'bool',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        is_cross_mkt: {
          type: 'bool',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        unquoted: {
          type: 'bool',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        consideration: {
          type: 'double',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        trader_id_list: {
          rule: 'repeated',
          type: 'string',
          id: 10
        },
        is_yield: {
          type: 'bool',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        is_offset: {
          type: 'bool',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        is_duration: {
          type: 'bool',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        is_consideration: {
          type: 'bool',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        is_coupon_rate: {
          type: 'bool',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        coupon_rate: {
          type: 'RangeDoubleStruct',
          id: 16,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    TableRelatedFilter: {
      oneofs: {
        _is_vip: {
          oneof: ['is_vip']
        },
        _has_underwriter_code: {
          oneof: ['has_underwriter_code']
        },
        _flag_internal: {
          oneof: ['flag_internal']
        },
        _flag_urgent: {
          oneof: ['flag_urgent']
        },
        _is_scattered: {
          oneof: ['is_scattered']
        },
        _date_type: {
          oneof: ['date_type']
        },
        _date_range: {
          oneof: ['date_range']
        },
        _side: {
          oneof: ['side']
        },
        _is_exercise: {
          oneof: ['is_exercise']
        },
        _is_nd: {
          oneof: ['is_nd']
        },
        _ofr_volume: {
          oneof: ['ofr_volume']
        },
        _flag_recommend: {
          oneof: ['flag_recommend']
        },
        _is_lead: {
          oneof: ['is_lead']
        },
        _nothing_done: {
          oneof: ['nothing_done']
        },
        _flag_full: {
          oneof: ['flag_full']
        },
        _flag_brokerage: {
          oneof: ['flag_brokerage']
        }
      },
      fields: {
        is_vip: {
          type: 'bool',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        has_underwriter_code: {
          type: 'bool',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        broker_id_list: {
          rule: 'repeated',
          type: 'string',
          id: 3
        },
        flag_internal: {
          type: 'bool',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        flag_urgent: {
          type: 'bool',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        is_scattered: {
          type: 'bool',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        date_type: {
          type: 'DealDateTypeEnum',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        date_range: {
          type: 'RangeTimeStruct',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        side: {
          type: 'SideEnum',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        is_exercise: {
          type: 'bool',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        is_nd: {
          type: 'bool',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        ref_type_list: {
          rule: 'repeated',
          type: 'RefTypeEnum',
          id: 12
        },
        ofr_volume: {
          type: 'int32',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        clear_speed_list: {
          rule: 'repeated',
          type: 'string',
          id: 14
        },
        flag_recommend: {
          type: 'bool',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        is_lead: {
          type: 'bool',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        liquidation_speed_list: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 17
        },
        nothing_done: {
          type: 'bool',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        flag_full: {
          type: 'bool',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        flag_brokerage: {
          type: 'bool',
          id: 20,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    InputFilter: {
      oneofs: {
        _user_input: {
          oneof: ['user_input']
        }
      },
      fields: {
        bond_id_list: {
          rule: 'repeated',
          type: 'string',
          id: 1
        },
        inst_id_list: {
          rule: 'repeated',
          type: 'string',
          id: 2
        },
        trader_id_list: {
          rule: 'repeated',
          type: 'string',
          id: 3
        },
        broker_id_list: {
          rule: 'repeated',
          type: 'string',
          id: 4
        },
        user_input: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        key_market_list: {
          rule: 'repeated',
          type: 'string',
          id: 6
        },
        bond_key_list: {
          rule: 'repeated',
          type: 'string',
          id: 7
        }
      }
    },
    GeneralFilter: {
      oneofs: {
        _inst_is_listed: {
          oneof: ['inst_is_listed']
        },
        _with_warranty: {
          oneof: ['with_warranty']
        },
        _is_municipal: {
          oneof: ['is_municipal']
        },
        _is_platform_bond: {
          oneof: ['is_platform_bond']
        },
        _has_option: {
          oneof: ['has_option']
        },
        _bond_issue_info_filter: {
          oneof: ['bond_issue_info_filter']
        },
        _maturity_is_holiday: {
          oneof: ['maturity_is_holiday']
        },
        _is_abs: {
          oneof: ['is_abs']
        }
      },
      fields: {
        bond_category_list: {
          rule: 'repeated',
          type: 'BondCategoryEnum',
          id: 1
        },
        institution_subtype_list: {
          rule: 'repeated',
          type: 'InstitutionSubtypeEnum',
          id: 2
        },
        listed_market_list: {
          rule: 'repeated',
          type: 'ListedMarketEnum',
          id: 3
        },
        collection_method_list: {
          rule: 'repeated',
          type: 'CollectionMethodEnum',
          id: 4
        },
        inst_is_listed: {
          type: 'bool',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        bond_sector_list: {
          rule: 'repeated',
          type: 'BondSectorEnum',
          id: 6
        },
        remain_days_list: {
          rule: 'repeated',
          type: 'RangeIntegerStruct',
          id: 7
        },
        mkt_type_list: {
          rule: 'repeated',
          type: 'MktTypeEnum',
          id: 8
        },
        issuer_rating_list: {
          rule: 'repeated',
          type: 'RatingEnum',
          id: 9
        },
        implied_rating_list: {
          rule: 'repeated',
          type: 'RatingEnum',
          id: 10
        },
        cbc_rating_list: {
          rule: 'repeated',
          type: 'RatingEnum',
          id: 11
        },
        with_warranty: {
          type: 'bool',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        fr_type_list: {
          rule: 'repeated',
          type: 'FRTypeEnum',
          id: 13
        },
        is_municipal: {
          type: 'bool',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        is_platform_bond: {
          type: 'bool',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        area_level_list: {
          rule: 'repeated',
          type: 'AreaLevelEnum',
          id: 16
        },
        has_option: {
          type: 'bool',
          id: 17,
          options: {
            deprecated: true,
            proto3_optional: true
          }
        },
        perp_type_list: {
          rule: 'repeated',
          type: 'PerpTypeEnum',
          id: 18,
          options: {
            deprecated: true
          }
        },
        bond_issue_info_filter: {
          type: 'BondIssueInfo',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        maturity_is_holiday: {
          type: 'bool',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        bond_short_name_list: {
          rule: 'repeated',
          type: 'BondShortNameEnum',
          id: 21
        },
        bond_nature_list: {
          rule: 'repeated',
          type: 'BondNatureEnum',
          id: 22
        },
        is_abs: {
          type: 'bool',
          id: 23,
          options: {
            proto3_optional: true
          }
        },
        bank_type_list: {
          rule: 'repeated',
          type: 'BankTypeEnum',
          id: 24
        },
        ncd_subtype_list: {
          rule: 'repeated',
          type: 'NcdSubtypeEnum',
          id: 25
        },
        option_perp_filter_list: {
          rule: 'repeated',
          type: 'OptionPerpFilter',
          id: 26
        },
        maturity_date_type_list: {
          rule: 'repeated',
          type: 'MaturityDateTypeEnum',
          id: 27
        }
      }
    },
    GroupFilter: {
      oneofs: {
        _quick_filter: {
          oneof: ['quick_filter']
        },
        _general_filter: {
          oneof: ['general_filter']
        }
      },
      fields: {
        quick_filter: {
          type: 'QuickFilter',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        general_filter: {
          type: 'GeneralFilter',
          id: 2,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    OptionPerpFilter: {
      oneofs: {
        _has_option: {
          oneof: ['has_option']
        }
      },
      fields: {
        has_option: {
          type: 'bool',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        perp_type_list: {
          rule: 'repeated',
          type: 'PerpTypeEnum',
          id: 2
        }
      }
    },
    SortingMethodStruct: {
      fields: {
        sorted_field: {
          type: 'QuoteSortedFieldEnum',
          id: 1
        },
        is_desc: {
          type: 'bool',
          id: 2
        }
      }
    },
    IndustryStruct: {
      fields: {
        industry_id: {
          type: 'string',
          id: 1
        },
        name: {
          type: 'string',
          id: 2
        },
        level: {
          type: 'int32',
          id: 3
        },
        parent_industry_id: {
          type: 'string',
          id: 4
        },
        deleted: {
          type: 'int32',
          id: 5
        }
      }
    },
    BondIssueInfo: {
      fields: {
        sw_sector_list: {
          rule: 'repeated',
          type: 'string',
          id: 1
        },
        sw_subsector_list: {
          rule: 'repeated',
          type: 'string',
          id: 2
        },
        province_list: {
          rule: 'repeated',
          type: 'string',
          id: 3
        },
        city_list: {
          rule: 'repeated',
          type: 'string',
          id: 4
        },
        year_list: {
          rule: 'repeated',
          type: 'int32',
          id: 5
        },
        issuer_id_list: {
          rule: 'repeated',
          type: 'string',
          id: 6
        },
        warranter_id_list: {
          rule: 'repeated',
          type: 'string',
          id: 7
        }
      }
    },
    BondCrossMktStruct: {
      fields: {
        code_market: {
          type: 'string',
          id: 2
        },
        bond_code: {
          type: 'string',
          id: 3
        }
      }
    },
    BondLiteStruct: {
      oneofs: {
        _update_time: {
          oneof: ['update_time']
        },
        _create_time: {
          oneof: ['create_time']
        },
        _rest_day_to_workday: {
          oneof: ['rest_day_to_workday']
        },
        _repayment_method: {
          oneof: ['repayment_method']
        },
        _issue_rate: {
          oneof: ['issue_rate']
        }
      },
      fields: {
        product_type: {
          type: 'ProductTypeEnum',
          id: 2
        },
        code_market: {
          type: 'string',
          id: 3
        },
        has_option: {
          type: 'bool',
          id: 4
        },
        time_to_maturity: {
          type: 'string',
          id: 6
        },
        bond_code: {
          type: 'string',
          id: 7
        },
        short_name: {
          type: 'string',
          id: 8
        },
        issuer_rating: {
          type: 'string',
          id: 10
        },
        update_time: {
          type: 'string',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        rating: {
          type: 'string',
          id: 12
        },
        val_clean_price_exe: {
          type: 'double',
          id: 13
        },
        val_yield_exe: {
          type: 'double',
          id: 14
        },
        csi_clean_price_exe: {
          type: 'double',
          id: 15
        },
        csi_full_price_exe: {
          type: 'double',
          id: 16
        },
        csi_yield_exe: {
          type: 'double',
          id: 17
        },
        val_clean_price_mat: {
          type: 'double',
          id: 18
        },
        val_yield_mat: {
          type: 'double',
          id: 19
        },
        csi_clean_price_mat: {
          type: 'double',
          id: 20
        },
        csi_full_price_mat: {
          type: 'double',
          id: 21
        },
        csi_yield_mat: {
          type: 'double',
          id: 22
        },
        option_type: {
          type: 'OptionTypeEnum',
          id: 23
        },
        listed_market: {
          type: 'string',
          id: 24
        },
        listed_date: {
          type: 'string',
          id: 25
        },
        delisted_date: {
          type: 'string',
          id: 26
        },
        bond_category: {
          type: 'BondCategoryEnum',
          id: 27
        },
        val_modified_duration: {
          type: 'double',
          id: 28
        },
        redemption_no: {
          type: 'int32',
          id: 31
        },
        perp_type: {
          type: 'PerpTypeEnum',
          id: 32
        },
        fr_type: {
          type: 'FRTypeEnum',
          id: 33
        },
        issue_amount: {
          type: 'double',
          id: 36
        },
        create_time: {
          type: 'string',
          id: 37,
          options: {
            proto3_optional: true
          }
        },
        conversion_rate: {
          type: 'double',
          id: 38
        },
        cbc_rating: {
          type: 'string',
          id: 39
        },
        maturity_date: {
          type: 'string',
          id: 40
        },
        coupon_rate_current: {
          type: 'double',
          id: 41
        },
        maturity_is_holiday: {
          type: 'bool',
          id: 42
        },
        next_coupon_date: {
          type: 'string',
          id: 43
        },
        is_cross_mkt: {
          type: 'bool',
          id: 45
        },
        mkt_type: {
          type: 'MktTypeEnum',
          id: 47
        },
        rest_day_to_workday: {
          type: 'RestDayToWorkdayStruct',
          id: 48,
          options: {
            proto3_optional: true
          }
        },
        is_fixed_rate: {
          type: 'bool',
          id: 49
        },
        fund_objective_category: {
          type: 'string',
          id: 50
        },
        fund_objective_sub_category: {
          type: 'string',
          id: 51
        },
        implied_rating: {
          type: 'string',
          id: 52
        },
        interest_start_date: {
          type: 'string',
          id: 53
        },
        bond_cross_mkt_list: {
          rule: 'repeated',
          type: 'BondCrossMktStruct',
          id: 54
        },
        repayment_method: {
          type: 'RepaymentMethodEnum',
          id: 55,
          options: {
            proto3_optional: true
          }
        },
        issue_rate: {
          type: 'double',
          id: 56,
          options: {
            proto3_optional: true
          }
        },
        key_market: {
          type: 'string',
          id: 58
        },
        with_warranty: {
          type: 'bool',
          id: 60
        },
        val_basis_point_value: {
          type: 'double',
          id: 61
        },
        option_date: {
          type: 'string',
          id: 62
        },
        display_code: {
          type: 'string',
          id: 63
        }
      }
    },
    QuoteLiteStruct: {
      oneofs: {
        _bond_id: {
          oneof: ['bond_id']
        },
        _broker_id: {
          oneof: ['broker_id']
        },
        _trader_id: {
          oneof: ['trader_id']
        },
        _inst_id: {
          oneof: ['inst_id']
        },
        _operator_id: {
          oneof: ['operator_id']
        },
        _bond_info: {
          oneof: ['bond_info']
        },
        _broker_info: {
          oneof: ['broker_info']
        },
        _trader_info: {
          oneof: ['trader_info']
        },
        _inst_info: {
          oneof: ['inst_info']
        },
        _operator_info: {
          oneof: ['operator_info']
        },
        _refer_time: {
          oneof: ['refer_time']
        },
        _flag_stock_exchange: {
          oneof: ['flag_stock_exchange']
        },
        _flag_bilateral: {
          oneof: ['flag_bilateral']
        },
        _flag_request: {
          oneof: ['flag_request']
        },
        _flag_indivisible: {
          oneof: ['flag_indivisible']
        },
        _flag_stc: {
          oneof: ['flag_stc']
        },
        _exercise_manual: {
          oneof: ['exercise_manual']
        },
        _bond_basic_info: {
          oneof: ['bond_basic_info']
        }
      },
      fields: {
        quote_id: {
          type: 'string',
          id: 1
        },
        update_time: {
          type: 'string',
          id: 40
        },
        product_type: {
          type: 'ProductTypeEnum',
          id: 41
        },
        bond_id: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        broker_id: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        trader_id: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        inst_id: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        operator_id: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        bond_info: {
          type: 'BondLiteStruct',
          id: 7,
          options: {
            deprecated: true,
            proto3_optional: true
          }
        },
        broker_info: {
          type: 'BrokerStruct',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        trader_info: {
          type: 'TraderLiteStruct',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        inst_info: {
          type: 'InstitutionTinyStruct',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        operator_info: {
          type: 'BrokerStruct',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        side: {
          type: 'int32',
          id: 12
        },
        yield: {
          type: 'double',
          id: 13
        },
        clean_price: {
          type: 'double',
          id: 14
        },
        full_price: {
          type: 'double',
          id: 15
        },
        volume: {
          type: 'double',
          id: 16
        },
        comment: {
          type: 'string',
          id: 20
        },
        return_point: {
          type: 'double',
          id: 21
        },
        flag_rebate: {
          type: 'bool',
          id: 22
        },
        spread: {
          type: 'double',
          id: 23
        },
        refer_type: {
          type: 'RefTypeEnum',
          id: 26
        },
        deal_status: {
          type: 'int32',
          id: 27
        },
        deal_date: {
          type: 'string',
          id: 28
        },
        flag_recommend: {
          type: 'bool',
          id: 29
        },
        almost_done: {
          type: 'bool',
          id: 30
        },
        flag_internal: {
          type: 'bool',
          id: 31
        },
        flag_exchange: {
          type: 'bool',
          id: 32
        },
        flag_oco: {
          type: 'bool',
          id: 33
        },
        flag_star: {
          type: 'int32',
          id: 34
        },
        flag_urgent: {
          type: 'bool',
          id: 35
        },
        flag_package: {
          type: 'bool',
          id: 36
        },
        is_exercise: {
          type: 'bool',
          id: 37
        },
        flag_intention: {
          type: 'bool',
          id: 38
        },
        quote_type: {
          type: 'BondQuoteTypeEnum',
          id: 39
        },
        refer_time: {
          type: 'string',
          id: 43,
          options: {
            proto3_optional: true
          }
        },
        liquidation_speed_list: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 44
        },
        create_time: {
          type: 'string',
          id: 45
        },
        bond_key_market: {
          type: 'string',
          id: 46
        },
        flag_code_changed: {
          type: 'bool',
          id: 47
        },
        flag_stock_exchange: {
          type: 'bool',
          id: 48,
          options: {
            proto3_optional: true
          }
        },
        flag_bilateral: {
          type: 'bool',
          id: 49,
          options: {
            proto3_optional: true
          }
        },
        flag_request: {
          type: 'bool',
          id: 50,
          options: {
            proto3_optional: true
          }
        },
        flag_indivisible: {
          type: 'bool',
          id: 51,
          options: {
            proto3_optional: true
          }
        },
        flag_stc: {
          type: 'bool',
          id: 52,
          options: {
            proto3_optional: true
          }
        },
        exercise_manual: {
          type: 'bool',
          id: 53,
          options: {
            proto3_optional: true
          }
        },
        bond_basic_info: {
          type: 'FiccBondBasicStruct',
          id: 54,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    DealQuoteStruct: {
      oneofs: {
        _broker_id: {
          oneof: ['broker_id']
        },
        _trader_id: {
          oneof: ['trader_id']
        },
        _inst_id: {
          oneof: ['inst_id']
        },
        _operator_id: {
          oneof: ['operator_id']
        },
        _broker_info: {
          oneof: ['broker_info']
        },
        _trader_info: {
          oneof: ['trader_info']
        },
        _inst_info: {
          oneof: ['inst_info']
        },
        _yield: {
          oneof: ['yield']
        },
        _clean_price: {
          oneof: ['clean_price']
        },
        _full_price: {
          oneof: ['full_price']
        },
        _return_point: {
          oneof: ['return_point']
        },
        _spread: {
          oneof: ['spread']
        }
      },
      fields: {
        quote_id: {
          type: 'string',
          id: 1
        },
        create_time: {
          type: 'string',
          id: 2
        },
        update_time: {
          type: 'string',
          id: 3
        },
        product_type: {
          type: 'ProductTypeEnum',
          id: 4
        },
        bond_key_market: {
          type: 'string',
          id: 5
        },
        broker_id: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        trader_id: {
          type: 'string',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        inst_id: {
          type: 'string',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        operator_id: {
          type: 'string',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        broker_info: {
          type: 'BrokerStruct',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        trader_info: {
          type: 'TraderLiteStruct',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        inst_info: {
          type: 'InstitutionTinyStruct',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        side: {
          type: 'int32',
          id: 13
        },
        quote_type: {
          type: 'BondQuoteTypeEnum',
          id: 14
        },
        quote_price: {
          type: 'double',
          id: 15
        },
        yield: {
          type: 'double',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        clean_price: {
          type: 'double',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        full_price: {
          type: 'double',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        return_point: {
          type: 'double',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        spread: {
          type: 'double',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        volume: {
          type: 'double',
          id: 21
        },
        comment: {
          type: 'string',
          id: 22
        },
        flag_rebate: {
          type: 'bool',
          id: 23
        },
        flag_internal: {
          type: 'bool',
          id: 24
        },
        flag_exchange: {
          type: 'bool',
          id: 25
        },
        flag_oco: {
          type: 'bool',
          id: 26
        },
        flag_star: {
          type: 'int32',
          id: 27
        },
        flag_urgent: {
          type: 'bool',
          id: 28
        },
        flag_package: {
          type: 'bool',
          id: 29
        },
        is_exercise: {
          type: 'bool',
          id: 30
        },
        flag_intention: {
          type: 'bool',
          id: 31
        },
        flag_stock_exchange: {
          type: 'bool',
          id: 32
        },
        flag_bilateral: {
          type: 'bool',
          id: 33
        },
        flag_request: {
          type: 'bool',
          id: 34
        },
        flag_indivisible: {
          type: 'bool',
          id: 35
        },
        flag_stc: {
          type: 'bool',
          id: 36
        },
        exercise_manual: {
          type: 'bool',
          id: 37
        },
        liquidation_speed_list: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 38
        },
        deal_liquidation_speed_list: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 39
        }
      }
    },
    BondOptimalQuoteStruct: {
      oneofs: {
        _update_time: {
          oneof: ['update_time']
        },
        _clean_price_int_bid: {
          oneof: ['clean_price_int_bid']
        },
        _clean_price_ext_bid: {
          oneof: ['clean_price_ext_bid']
        },
        _clean_price_int_ofr: {
          oneof: ['clean_price_int_ofr']
        },
        _clean_price_ext_ofr: {
          oneof: ['clean_price_ext_ofr']
        }
      },
      fields: {
        bond_info: {
          type: 'BondLiteStruct',
          id: 1,
          options: {
            deprecated: true
          }
        },
        optimal_quote_id_bid: {
          type: 'string',
          id: 2
        },
        optimal_quote_id_ofr: {
          type: 'string',
          id: 3
        },
        optimal_price_id_list_bid: {
          rule: 'repeated',
          type: 'string',
          id: 4
        },
        optimal_price_id_list_ofr: {
          rule: 'repeated',
          type: 'string',
          id: 5
        },
        quote_bid_list: {
          rule: 'repeated',
          type: 'QuoteLiteStruct',
          id: 6
        },
        quote_ofr_list: {
          rule: 'repeated',
          type: 'QuoteLiteStruct',
          id: 7
        },
        n_bid: {
          type: 'int32',
          id: 8
        },
        n_ofr: {
          type: 'int32',
          id: 9
        },
        price_int_bid: {
          type: 'double',
          id: 10
        },
        price_ext_bid: {
          type: 'double',
          id: 11
        },
        price_int_ofr: {
          type: 'double',
          id: 12
        },
        price_ext_ofr: {
          type: 'double',
          id: 13
        },
        quote_id_int_bid: {
          type: 'string',
          id: 14
        },
        quote_id_ext_bid: {
          type: 'string',
          id: 15
        },
        quote_id_int_ofr: {
          type: 'string',
          id: 16
        },
        quote_id_ext_ofr: {
          type: 'string',
          id: 17
        },
        volume_int_bid: {
          rule: 'repeated',
          type: 'double',
          id: 18
        },
        volume_ext_bid: {
          rule: 'repeated',
          type: 'double',
          id: 19
        },
        volume_int_ofr: {
          rule: 'repeated',
          type: 'double',
          id: 20
        },
        volume_ext_ofr: {
          rule: 'repeated',
          type: 'double',
          id: 21
        },
        offset_bid: {
          type: 'double',
          id: 22
        },
        offset_ofr: {
          type: 'double',
          id: 23
        },
        flag_deal_price_bid: {
          type: 'bool',
          id: 24
        },
        flag_deal_price_ofr: {
          type: 'bool',
          id: 25
        },
        update_time: {
          type: 'string',
          id: 26,
          options: {
            proto3_optional: true
          }
        },
        optimal_price_ext_id_list_bid: {
          rule: 'repeated',
          type: 'string',
          id: 27
        },
        optimal_price_ext_id_list_ofr: {
          rule: 'repeated',
          type: 'string',
          id: 28
        },
        clean_price_int_bid: {
          type: 'double',
          id: 29,
          options: {
            proto3_optional: true
          }
        },
        clean_price_ext_bid: {
          type: 'double',
          id: 30,
          options: {
            proto3_optional: true
          }
        },
        clean_price_int_ofr: {
          type: 'double',
          id: 31,
          options: {
            proto3_optional: true
          }
        },
        clean_price_ext_ofr: {
          type: 'double',
          id: 32,
          options: {
            proto3_optional: true
          }
        },
        bond_basic_info: {
          type: 'FiccBondBasicStruct',
          id: 33
        }
      }
    },
    UserHotkeyStruct: {
      fields: {
        function: {
          type: 'UserHotkeyFunctionEnum',
          id: 1
        },
        value: {
          type: 'string',
          id: 2
        },
        desc: {
          type: 'string',
          id: 3
        }
      }
    },
    UserSettingStruct: {
      fields: {
        function: {
          type: 'UserSettingFunctionEnum',
          id: 1
        },
        value: {
          type: 'string',
          id: 2
        }
      }
    },
    UserPreferenceStruct: {
      fields: {
        preference_type: {
          type: 'UserPreferenceTypeEnum',
          id: 1
        },
        key: {
          type: 'string',
          id: 2
        },
        value: {
          type: 'string',
          id: 3
        }
      }
    },
    UserAccessGrantUpsertStruct: {
      fields: {
        grantee_id: {
          type: 'string',
          id: 1
        },
        granter_id: {
          rule: 'repeated',
          type: 'string',
          id: 2
        }
      }
    },
    UserAccessGrantCreateStruct: {
      fields: {
        grantee_id: {
          type: 'string',
          id: 1
        },
        granter_id: {
          rule: 'repeated',
          type: 'string',
          id: 2
        }
      }
    },
    UserAccessGrantStruct: {
      fields: {
        grantee: {
          type: 'UserLiteStruct',
          id: 1
        },
        granter_list: {
          rule: 'repeated',
          type: 'UserLiteStruct',
          id: 2,
          options: {
            deprecated: true
          }
        },
        granter_access_list: {
          rule: 'repeated',
          type: 'GranterAccessStruct',
          id: 3
        }
      }
    },
    GranterAccessStruct: {
      fields: {
        granter: {
          type: 'UserLiteStruct',
          id: 1
        },
        access_grant_list: {
          rule: 'repeated',
          type: 'UserAccessGrantTypeEnum',
          id: 2
        }
      }
    },
    GranterIdAccessStruct: {
      fields: {
        granter_id: {
          type: 'string',
          id: 1
        },
        access_grant_list: {
          rule: 'repeated',
          type: 'UserAccessGrantTypeEnum',
          id: 2
        }
      }
    },
    QuoteInsertStruct: {
      oneofs: {
        _algo_tags: {
          oneof: ['algo_tags']
        },
        _yield: {
          oneof: ['yield']
        },
        _clean_price: {
          oneof: ['clean_price']
        },
        _full_price: {
          oneof: ['full_price']
        },
        _volume: {
          oneof: ['volume']
        },
        _traded_date: {
          oneof: ['traded_date']
        },
        _settlement_date: {
          oneof: ['settlement_date']
        },
        _delivery_date: {
          oneof: ['delivery_date']
        },
        _comment: {
          oneof: ['comment']
        },
        _return_point: {
          oneof: ['return_point']
        },
        _spread: {
          oneof: ['spread']
        },
        _clear_speed: {
          oneof: ['clear_speed']
        },
        _flag_internal: {
          oneof: ['flag_internal']
        },
        _flag_urgent: {
          oneof: ['flag_urgent']
        },
        _flag_exchange: {
          oneof: ['flag_exchange']
        },
        _flag_star: {
          oneof: ['flag_star']
        },
        _flag_oco: {
          oneof: ['flag_oco']
        },
        _flag_package: {
          oneof: ['flag_package']
        },
        _flag_recommend: {
          oneof: ['flag_recommend']
        },
        _is_exercise: {
          oneof: ['is_exercise']
        },
        _flag_rebate: {
          oneof: ['flag_rebate']
        },
        _flag_intention: {
          oneof: ['flag_intention']
        },
        _trader_tag: {
          oneof: ['trader_tag']
        },
        _flag_stock_exchange: {
          oneof: ['flag_stock_exchange']
        },
        _flag_bilateral: {
          oneof: ['flag_bilateral']
        },
        _flag_request: {
          oneof: ['flag_request']
        },
        _flag_indivisible: {
          oneof: ['flag_indivisible']
        },
        _exercise_manual: {
          oneof: ['exercise_manual']
        }
      },
      fields: {
        bond_key_market: {
          type: 'string',
          id: 1
        },
        broker_id: {
          type: 'string',
          id: 2
        },
        trader_id: {
          type: 'string',
          id: 3
        },
        algo_tags: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        side: {
          type: 'int32',
          id: 5
        },
        yield: {
          type: 'double',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        clean_price: {
          type: 'double',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        full_price: {
          type: 'double',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        volume: {
          type: 'double',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        traded_date: {
          type: 'string',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        settlement_date: {
          type: 'string',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        delivery_date: {
          type: 'string',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        comment: {
          type: 'string',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        return_point: {
          type: 'double',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        spread: {
          type: 'double',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        clear_speed: {
          type: 'string',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        flag_internal: {
          type: 'bool',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        flag_urgent: {
          type: 'bool',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        flag_exchange: {
          type: 'bool',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        flag_star: {
          type: 'int32',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        flag_oco: {
          type: 'bool',
          id: 21,
          options: {
            proto3_optional: true
          }
        },
        flag_package: {
          type: 'bool',
          id: 22,
          options: {
            proto3_optional: true
          }
        },
        flag_recommend: {
          type: 'bool',
          id: 23,
          options: {
            proto3_optional: true
          }
        },
        is_exercise: {
          type: 'bool',
          id: 24,
          options: {
            proto3_optional: true
          }
        },
        flag_rebate: {
          type: 'bool',
          id: 25,
          options: {
            proto3_optional: true
          }
        },
        quote_type: {
          type: 'BondQuoteTypeEnum',
          id: 26
        },
        flag_intention: {
          type: 'bool',
          id: 27,
          options: {
            proto3_optional: true
          }
        },
        trader_tag: {
          type: 'string',
          id: 28,
          options: {
            proto3_optional: true
          }
        },
        liquidation_speed_list: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 29
        },
        flag_stock_exchange: {
          type: 'bool',
          id: 30,
          options: {
            proto3_optional: true
          }
        },
        flag_bilateral: {
          type: 'bool',
          id: 31,
          options: {
            proto3_optional: true
          }
        },
        flag_request: {
          type: 'bool',
          id: 32,
          options: {
            proto3_optional: true
          }
        },
        flag_indivisible: {
          type: 'bool',
          id: 33,
          options: {
            proto3_optional: true
          }
        },
        exercise_manual: {
          type: 'bool',
          id: 34,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    QuoteUpdateStruct: {
      oneofs: {
        _broker_id: {
          oneof: ['broker_id']
        },
        _trader_id: {
          oneof: ['trader_id']
        },
        _algo_tags: {
          oneof: ['algo_tags']
        },
        _side: {
          oneof: ['side']
        },
        _yield: {
          oneof: ['yield']
        },
        _clean_price: {
          oneof: ['clean_price']
        },
        _full_price: {
          oneof: ['full_price']
        },
        _volume: {
          oneof: ['volume']
        },
        _traded_date: {
          oneof: ['traded_date']
        },
        _settlement_date: {
          oneof: ['settlement_date']
        },
        _delivery_date: {
          oneof: ['delivery_date']
        },
        _comment: {
          oneof: ['comment']
        },
        _return_point: {
          oneof: ['return_point']
        },
        _spread: {
          oneof: ['spread']
        },
        _clear_speed: {
          oneof: ['clear_speed']
        },
        _flag_internal: {
          oneof: ['flag_internal']
        },
        _flag_urgent: {
          oneof: ['flag_urgent']
        },
        _flag_exchange: {
          oneof: ['flag_exchange']
        },
        _flag_star: {
          oneof: ['flag_star']
        },
        _flag_oco: {
          oneof: ['flag_oco']
        },
        _flag_package: {
          oneof: ['flag_package']
        },
        _flag_recommend: {
          oneof: ['flag_recommend']
        },
        _is_exercise: {
          oneof: ['is_exercise']
        },
        _flag_rebate: {
          oneof: ['flag_rebate']
        },
        _quote_type: {
          oneof: ['quote_type']
        },
        _almost_done: {
          oneof: ['almost_done']
        },
        _flag_intention: {
          oneof: ['flag_intention']
        },
        _refer_type: {
          oneof: ['refer_type']
        },
        _enable: {
          oneof: ['enable']
        },
        _trader_tag: {
          oneof: ['trader_tag']
        },
        _operation_type: {
          oneof: ['operation_type']
        },
        _flag_stock_exchange: {
          oneof: ['flag_stock_exchange']
        },
        _flag_bilateral: {
          oneof: ['flag_bilateral']
        },
        _flag_request: {
          oneof: ['flag_request']
        },
        _flag_indivisible: {
          oneof: ['flag_indivisible']
        },
        _exercise_manual: {
          oneof: ['exercise_manual']
        }
      },
      fields: {
        quote_id: {
          type: 'string',
          id: 1
        },
        broker_id: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        trader_id: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        algo_tags: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        side: {
          type: 'int32',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        yield: {
          type: 'double',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        clean_price: {
          type: 'double',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        full_price: {
          type: 'double',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        volume: {
          type: 'double',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        traded_date: {
          type: 'string',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        settlement_date: {
          type: 'string',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        delivery_date: {
          type: 'string',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        comment: {
          type: 'string',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        return_point: {
          type: 'double',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        spread: {
          type: 'double',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        clear_speed: {
          type: 'string',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        flag_internal: {
          type: 'bool',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        flag_urgent: {
          type: 'bool',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        flag_exchange: {
          type: 'bool',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        flag_star: {
          type: 'int32',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        flag_oco: {
          type: 'bool',
          id: 21,
          options: {
            proto3_optional: true
          }
        },
        flag_package: {
          type: 'bool',
          id: 22,
          options: {
            proto3_optional: true
          }
        },
        flag_recommend: {
          type: 'bool',
          id: 23,
          options: {
            proto3_optional: true
          }
        },
        is_exercise: {
          type: 'bool',
          id: 24,
          options: {
            proto3_optional: true
          }
        },
        flag_rebate: {
          type: 'bool',
          id: 25,
          options: {
            proto3_optional: true
          }
        },
        quote_type: {
          type: 'BondQuoteTypeEnum',
          id: 26,
          options: {
            proto3_optional: true
          }
        },
        almost_done: {
          type: 'bool',
          id: 27,
          options: {
            proto3_optional: true
          }
        },
        flag_intention: {
          type: 'bool',
          id: 28,
          options: {
            proto3_optional: true
          }
        },
        refer_type: {
          type: 'RefTypeEnum',
          id: 29,
          options: {
            proto3_optional: true
          }
        },
        enable: {
          type: 'EnableEnum',
          id: 30,
          options: {
            proto3_optional: true
          }
        },
        trader_tag: {
          type: 'string',
          id: 31,
          options: {
            proto3_optional: true
          }
        },
        liquidation_speed_list: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 32
        },
        operation_type: {
          type: 'OperationTypeEnum',
          id: 34,
          options: {
            proto3_optional: true
          }
        },
        flag_stock_exchange: {
          type: 'bool',
          id: 35,
          options: {
            proto3_optional: true
          }
        },
        flag_bilateral: {
          type: 'bool',
          id: 36,
          options: {
            proto3_optional: true
          }
        },
        flag_request: {
          type: 'bool',
          id: 37,
          options: {
            proto3_optional: true
          }
        },
        flag_indivisible: {
          type: 'bool',
          id: 38,
          options: {
            proto3_optional: true
          }
        },
        exercise_manual: {
          type: 'bool',
          id: 39,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    OperationInfo: {
      oneofs: {
        _operator: {
          oneof: ['operator']
        },
        _operation_source: {
          oneof: ['operation_source']
        }
      },
      fields: {
        operator: {
          type: 'string',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        operation_type: {
          type: 'OperationTypeEnum',
          id: 2
        },
        operation_source: {
          type: 'OperationSourceEnum',
          id: 3,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    BondQuoteStruct: {
      oneofs: {
        _yield: {
          oneof: ['yield']
        },
        _clean_price: {
          oneof: ['clean_price']
        },
        _full_price: {
          oneof: ['full_price']
        },
        _volume: {
          oneof: ['volume']
        },
        _traded_date: {
          oneof: ['traded_date']
        },
        _settlement_date: {
          oneof: ['settlement_date']
        },
        _delivery_date: {
          oneof: ['delivery_date']
        },
        _return_point: {
          oneof: ['return_point']
        },
        _spread: {
          oneof: ['spread']
        },
        _clear_speed: {
          oneof: ['clear_speed']
        },
        _source: {
          oneof: ['source']
        },
        _refer_type: {
          oneof: ['refer_type']
        },
        _deal_status: {
          oneof: ['deal_status']
        },
        _deal_date: {
          oneof: ['deal_date']
        },
        _asset_status: {
          oneof: ['asset_status']
        },
        _conversion_rate: {
          oneof: ['conversion_rate']
        },
        _flag_internal: {
          oneof: ['flag_internal']
        },
        _flag_urgent: {
          oneof: ['flag_urgent']
        },
        _flag_exchange: {
          oneof: ['flag_exchange']
        },
        _flag_star: {
          oneof: ['flag_star']
        },
        _flag_oco: {
          oneof: ['flag_oco']
        },
        _flag_package: {
          oneof: ['flag_package']
        },
        _algo_tags: {
          oneof: ['algo_tags']
        },
        _from_draft: {
          oneof: ['from_draft']
        },
        _flag_recommend: {
          oneof: ['flag_recommend']
        },
        _is_exercise: {
          oneof: ['is_exercise']
        },
        _almost_done: {
          oneof: ['almost_done']
        },
        _flag_rebate: {
          oneof: ['flag_rebate']
        },
        _flag_intention: {
          oneof: ['flag_intention']
        },
        _inst_short_name_zh: {
          oneof: ['inst_short_name_zh']
        },
        _trader_tag: {
          oneof: ['trader_tag']
        },
        _val_clean_price_exe: {
          oneof: ['val_clean_price_exe']
        },
        _val_clean_price_mat: {
          oneof: ['val_clean_price_mat']
        },
        _val_yield_exe: {
          oneof: ['val_yield_exe']
        },
        _val_yield_mat: {
          oneof: ['val_yield_mat']
        },
        _time_to_maturity: {
          oneof: ['time_to_maturity']
        },
        _rest_day_to_workday: {
          oneof: ['rest_day_to_workday']
        },
        _repayment_method: {
          oneof: ['repayment_method']
        },
        _broker_name: {
          oneof: ['broker_name']
        },
        _bond_rating_str: {
          oneof: ['bond_rating_str']
        },
        _issuer_rating_str: {
          oneof: ['issuer_rating_str']
        },
        _cbc_rating_str: {
          oneof: ['cbc_rating_str']
        },
        _inst_rating_str: {
          oneof: ['inst_rating_str']
        },
        _implied_rating_str: {
          oneof: ['implied_rating_str']
        },
        _option_type_val: {
          oneof: ['option_type_val']
        },
        _flag_stock_exchange: {
          oneof: ['flag_stock_exchange']
        },
        _flag_bilateral: {
          oneof: ['flag_bilateral']
        },
        _flag_request: {
          oneof: ['flag_request']
        },
        _flag_indivisible: {
          oneof: ['flag_indivisible']
        },
        _flag_stc: {
          oneof: ['flag_stc']
        },
        _exercise_manual: {
          oneof: ['exercise_manual']
        },
        _bond_display_code: {
          oneof: ['bond_display_code']
        }
      },
      fields: {
        quote_id: {
          type: 'string',
          id: 1
        },
        bond_id: {
          type: 'string',
          id: 2
        },
        broker_id: {
          type: 'string',
          id: 3
        },
        trader_id: {
          type: 'string',
          id: 4
        },
        side: {
          type: 'int32',
          id: 5
        },
        yield: {
          type: 'double',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        clean_price: {
          type: 'double',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        full_price: {
          type: 'double',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        volume: {
          type: 'double',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        traded_date: {
          type: 'string',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        settlement_date: {
          type: 'string',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        delivery_date: {
          type: 'string',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        comment: {
          type: 'string',
          id: 13
        },
        return_point: {
          type: 'double',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        spread: {
          type: 'double',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        clear_speed: {
          type: 'string',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        source: {
          type: 'int32',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        refer_type: {
          type: 'RefTypeEnum',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        deal_status: {
          type: 'int32',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        deal_date: {
          type: 'string',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        bond_code: {
          type: 'string',
          id: 21
        },
        bond_type: {
          type: 'string',
          id: 22
        },
        bond_short_name: {
          type: 'string',
          id: 23
        },
        bond_rating: {
          type: 'RatingEnum',
          id: 24
        },
        bond_key: {
          type: 'string',
          id: 25
        },
        listed_market: {
          type: 'string',
          id: 26
        },
        ent_cor: {
          type: 'string',
          id: 27
        },
        val_modified_duration: {
          type: 'float',
          id: 28
        },
        frn_index_id: {
          type: 'string',
          id: 29
        },
        coupon_type: {
          type: 'string',
          id: 30
        },
        option_type: {
          type: 'string',
          id: 31
        },
        mkt_type: {
          type: 'MktTypeEnum',
          id: 32
        },
        maturity_date: {
          type: 'string',
          id: 33
        },
        maturity_is_holiday: {
          type: 'bool',
          id: 34
        },
        product_type: {
          type: 'ProductTypeEnum',
          id: 36
        },
        selective_code: {
          type: 'string',
          id: 37
        },
        asset_status: {
          type: 'string',
          id: 38,
          options: {
            proto3_optional: true
          }
        },
        is_mortgage: {
          type: 'bool',
          id: 39
        },
        is_cross_mkt: {
          type: 'bool',
          id: 40
        },
        ficc_type_code: {
          type: 'string',
          id: 41
        },
        bond_ficc_type: {
          type: 'string',
          id: 42
        },
        listed_date: {
          type: 'string',
          id: 43
        },
        warranter: {
          type: 'string',
          id: 44
        },
        is_municipal: {
          type: 'bool',
          id: 45
        },
        term_structure: {
          type: 'string',
          id: 46
        },
        bond_full_name: {
          type: 'string',
          id: 47
        },
        redemption_no: {
          type: 'int32',
          id: 48
        },
        sceniority: {
          type: 'SceniorityEnum',
          id: 49
        },
        conversion_rate: {
          type: 'double',
          id: 50,
          options: {
            proto3_optional: true
          }
        },
        issuer_code: {
          type: 'string',
          id: 51
        },
        issuer_name: {
          type: 'string',
          id: 52
        },
        issuer_rating: {
          type: 'RatingEnum',
          id: 53
        },
        institution_subtype: {
          type: 'string',
          id: 54
        },
        cbc_rating: {
          type: 'RatingEnum',
          id: 55
        },
        cbrc_financing_platform: {
          type: 'string',
          id: 56
        },
        province: {
          type: 'string',
          id: 57
        },
        city: {
          type: 'string',
          id: 58
        },
        trader_name: {
          type: 'string',
          id: 59
        },
        is_vip: {
          type: 'bool',
          id: 60
        },
        is_danger: {
          type: 'bool',
          id: 61
        },
        is_bargain: {
          type: 'bool',
          id: 62
        },
        flag_internal: {
          type: 'bool',
          id: 64,
          options: {
            proto3_optional: true
          }
        },
        flag_urgent: {
          type: 'bool',
          id: 65,
          options: {
            proto3_optional: true
          }
        },
        flag_exchange: {
          type: 'bool',
          id: 66,
          options: {
            proto3_optional: true
          }
        },
        flag_star: {
          type: 'int32',
          id: 67,
          options: {
            proto3_optional: true
          }
        },
        flag_oco: {
          type: 'bool',
          id: 68,
          options: {
            proto3_optional: true
          }
        },
        flag_package: {
          type: 'bool',
          id: 69,
          options: {
            proto3_optional: true
          }
        },
        operator: {
          type: 'string',
          id: 70
        },
        create_time: {
          type: 'string',
          id: 71
        },
        update_time: {
          type: 'string',
          id: 72
        },
        val_yield: {
          type: 'float',
          id: 73
        },
        issue_year: {
          type: 'int32',
          id: 74
        },
        sw_sector: {
          type: 'string',
          id: 75
        },
        sw_sub_sector: {
          type: 'string',
          id: 76
        },
        delisted_date: {
          type: 'string',
          id: 77
        },
        algo_tags: {
          type: 'string',
          id: 78,
          options: {
            proto3_optional: true
          }
        },
        underwriter_code: {
          type: 'string',
          id: 79
        },
        area_level: {
          type: 'string',
          id: 80
        },
        inst_type: {
          type: 'string',
          id: 81
        },
        from_draft: {
          type: 'bool',
          id: 82,
          options: {
            proto3_optional: true
          }
        },
        inst_listed_type: {
          type: 'string',
          id: 83
        },
        quote_type: {
          type: 'BondQuoteTypeEnum',
          id: 84
        },
        bond_category: {
          type: 'BondCategoryEnum',
          id: 85
        },
        bond_sector: {
          type: 'BondSectorEnum',
          id: 86
        },
        fr_type: {
          type: 'FRTypeEnum',
          id: 87
        },
        perp_type: {
          type: 'PerpTypeEnum',
          id: 88
        },
        has_option: {
          type: 'bool',
          id: 89
        },
        flag_recommend: {
          type: 'bool',
          id: 90,
          options: {
            proto3_optional: true
          }
        },
        inst_rating: {
          type: 'RatingEnum',
          id: 91
        },
        implied_rating: {
          type: 'RatingEnum',
          id: 92
        },
        is_exercise: {
          type: 'bool',
          id: 93,
          options: {
            proto3_optional: true
          }
        },
        almost_done: {
          type: 'bool',
          id: 94,
          options: {
            proto3_optional: true
          }
        },
        flag_rebate: {
          type: 'bool',
          id: 95,
          options: {
            proto3_optional: true
          }
        },
        flag_intention: {
          type: 'bool',
          id: 96,
          options: {
            proto3_optional: true
          }
        },
        inst_short_name_zh: {
          type: 'string',
          id: 97,
          options: {
            proto3_optional: true
          }
        },
        trader_tag: {
          type: 'string',
          id: 98,
          options: {
            proto3_optional: true
          }
        },
        val_clean_price_exe: {
          type: 'double',
          id: 99,
          options: {
            proto3_optional: true
          }
        },
        val_clean_price_mat: {
          type: 'double',
          id: 100,
          options: {
            proto3_optional: true
          }
        },
        val_yield_exe: {
          type: 'double',
          id: 101,
          options: {
            proto3_optional: true
          }
        },
        val_yield_mat: {
          type: 'double',
          id: 102,
          options: {
            proto3_optional: true
          }
        },
        time_to_maturity: {
          type: 'string',
          id: 103,
          options: {
            proto3_optional: true
          }
        },
        rest_day_to_workday: {
          type: 'RestDayToWorkdayStruct',
          id: 104,
          options: {
            proto3_optional: true
          }
        },
        repayment_method: {
          type: 'RepaymentMethodEnum',
          id: 105,
          options: {
            proto3_optional: true
          }
        },
        broker_name: {
          type: 'string',
          id: 106,
          options: {
            proto3_optional: true
          }
        },
        bond_rating_str: {
          type: 'string',
          id: 107,
          options: {
            proto3_optional: true
          }
        },
        issuer_rating_str: {
          type: 'string',
          id: 108,
          options: {
            proto3_optional: true
          }
        },
        cbc_rating_str: {
          type: 'string',
          id: 109,
          options: {
            proto3_optional: true
          }
        },
        inst_rating_str: {
          type: 'string',
          id: 110,
          options: {
            proto3_optional: true
          }
        },
        implied_rating_str: {
          type: 'string',
          id: 111,
          options: {
            proto3_optional: true
          }
        },
        liquidation_speed_list: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 112
        },
        option_type_val: {
          type: 'OptionTypeEnum',
          id: 113,
          options: {
            proto3_optional: true
          }
        },
        bond_cross_mkt_list: {
          rule: 'repeated',
          type: 'BondCrossMktStruct',
          id: 114
        },
        flag_stock_exchange: {
          type: 'bool',
          id: 115,
          options: {
            proto3_optional: true
          }
        },
        flag_bilateral: {
          type: 'bool',
          id: 116,
          options: {
            proto3_optional: true
          }
        },
        flag_request: {
          type: 'bool',
          id: 117,
          options: {
            proto3_optional: true
          }
        },
        flag_indivisible: {
          type: 'bool',
          id: 118,
          options: {
            proto3_optional: true
          }
        },
        flag_stc: {
          type: 'bool',
          id: 119,
          options: {
            proto3_optional: true
          }
        },
        exercise_manual: {
          type: 'bool',
          id: 120,
          options: {
            proto3_optional: true
          }
        },
        bond_display_code: {
          type: 'string',
          id: 121,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    BondQuoteDraftStruct: {
      oneofs: {
        _yield: {
          oneof: ['yield']
        },
        _clean_price: {
          oneof: ['clean_price']
        },
        _full_price: {
          oneof: ['full_price']
        },
        _volume: {
          oneof: ['volume']
        },
        _traded_date: {
          oneof: ['traded_date']
        },
        _settlement_date: {
          oneof: ['settlement_date']
        },
        _delivery_date: {
          oneof: ['delivery_date']
        },
        _return_point: {
          oneof: ['return_point']
        },
        _spread: {
          oneof: ['spread']
        },
        _clear_speed: {
          oneof: ['clear_speed']
        },
        _source: {
          oneof: ['source']
        },
        _refer_type: {
          oneof: ['refer_type']
        },
        _deal_status: {
          oneof: ['deal_status']
        },
        _deal_date: {
          oneof: ['deal_date']
        },
        _asset_status: {
          oneof: ['asset_status']
        },
        _conversion_rate: {
          oneof: ['conversion_rate']
        },
        _flag_internal: {
          oneof: ['flag_internal']
        },
        _flag_urgent: {
          oneof: ['flag_urgent']
        },
        _flag_exchange: {
          oneof: ['flag_exchange']
        },
        _flag_star: {
          oneof: ['flag_star']
        },
        _flag_oco: {
          oneof: ['flag_oco']
        },
        _flag_package: {
          oneof: ['flag_package']
        },
        _algo_tags: {
          oneof: ['algo_tags']
        },
        _from_draft: {
          oneof: ['from_draft']
        },
        _reviewer_id: {
          oneof: ['reviewer_id']
        },
        _flag_recommend: {
          oneof: ['flag_recommend']
        }
      },
      fields: {
        quote_draft_id: {
          type: 'string',
          id: 1
        },
        bond_id: {
          type: 'string',
          id: 2
        },
        broker_id: {
          type: 'string',
          id: 3
        },
        trader_id: {
          type: 'string',
          id: 4
        },
        side: {
          type: 'int32',
          id: 5
        },
        yield: {
          type: 'double',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        clean_price: {
          type: 'double',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        full_price: {
          type: 'double',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        volume: {
          type: 'double',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        traded_date: {
          type: 'string',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        settlement_date: {
          type: 'string',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        delivery_date: {
          type: 'string',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        comment: {
          type: 'string',
          id: 13
        },
        is_exercise: {
          type: 'bool',
          id: 14
        },
        return_point: {
          type: 'double',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        spread: {
          type: 'double',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        clear_speed: {
          type: 'string',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        source: {
          type: 'int32',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        refer_type: {
          type: 'RefTypeEnum',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        deal_status: {
          type: 'int32',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        deal_date: {
          type: 'string',
          id: 21,
          options: {
            proto3_optional: true
          }
        },
        bond_code: {
          type: 'string',
          id: 22
        },
        bond_type: {
          type: 'string',
          id: 23
        },
        bond_short_name: {
          type: 'string',
          id: 24
        },
        bond_rating: {
          type: 'RatingEnum',
          id: 25
        },
        bond_key: {
          type: 'string',
          id: 26
        },
        listed_market: {
          type: 'string',
          id: 27
        },
        ent_cor: {
          type: 'string',
          id: 28
        },
        val_modified_duration: {
          type: 'double',
          id: 29
        },
        frn_index_id: {
          type: 'string',
          id: 30
        },
        coupon_type: {
          type: 'string',
          id: 31
        },
        option_type: {
          type: 'string',
          id: 32
        },
        mkt_type: {
          type: 'MktTypeEnum',
          id: 33
        },
        maturity_date: {
          type: 'string',
          id: 34
        },
        maturity_is_holiday: {
          type: 'bool',
          id: 35
        },
        product_type: {
          type: 'string',
          id: 36
        },
        selective_code: {
          type: 'string',
          id: 37
        },
        asset_status: {
          type: 'string',
          id: 38,
          options: {
            proto3_optional: true
          }
        },
        is_mortgage: {
          type: 'bool',
          id: 39
        },
        is_cross_mkt: {
          type: 'bool',
          id: 40
        },
        ficc_type_code: {
          type: 'string',
          id: 41
        },
        bond_ficc_type: {
          type: 'string',
          id: 42
        },
        listed_date: {
          type: 'string',
          id: 43
        },
        warranter: {
          type: 'string',
          id: 44
        },
        is_municipal: {
          type: 'bool',
          id: 45
        },
        term_structure: {
          type: 'string',
          id: 46
        },
        bond_full_name: {
          type: 'string',
          id: 47
        },
        redemption_no: {
          type: 'int32',
          id: 48
        },
        conversion_rate: {
          type: 'double',
          id: 49,
          options: {
            proto3_optional: true
          }
        },
        issuer_code: {
          type: 'string',
          id: 50
        },
        issuer_name: {
          type: 'string',
          id: 51
        },
        issuer_rating: {
          type: 'RatingEnum',
          id: 52
        },
        institution_subtype: {
          type: 'string',
          id: 53
        },
        cbc_rating: {
          type: 'RatingEnum',
          id: 54
        },
        cbrc_financing_platform: {
          type: 'string',
          id: 55
        },
        province: {
          type: 'string',
          id: 56
        },
        city: {
          type: 'string',
          id: 57
        },
        trader_name: {
          type: 'string',
          id: 58
        },
        is_vip: {
          type: 'bool',
          id: 59
        },
        is_danger: {
          type: 'bool',
          id: 60
        },
        is_bargain: {
          type: 'bool',
          id: 61
        },
        flag_internal: {
          type: 'bool',
          id: 63,
          options: {
            proto3_optional: true
          }
        },
        flag_urgent: {
          type: 'bool',
          id: 64,
          options: {
            proto3_optional: true
          }
        },
        flag_exchange: {
          type: 'bool',
          id: 65,
          options: {
            proto3_optional: true
          }
        },
        flag_star: {
          type: 'int32',
          id: 66,
          options: {
            proto3_optional: true
          }
        },
        flag_oco: {
          type: 'bool',
          id: 67,
          options: {
            proto3_optional: true
          }
        },
        flag_package: {
          type: 'bool',
          id: 68,
          options: {
            proto3_optional: true
          }
        },
        operator: {
          type: 'string',
          id: 69
        },
        create_time: {
          type: 'string',
          id: 70
        },
        update_time: {
          type: 'string',
          id: 71
        },
        val_yield: {
          type: 'double',
          id: 72
        },
        issue_year: {
          type: 'int32',
          id: 73
        },
        sw_sector: {
          type: 'string',
          id: 74
        },
        sw_sub_sector: {
          type: 'string',
          id: 75
        },
        delisted_date: {
          type: 'string',
          id: 76
        },
        algo_tags: {
          type: 'string',
          id: 77,
          options: {
            proto3_optional: true
          }
        },
        underwriter_code: {
          type: 'string',
          id: 78
        },
        area_level: {
          type: 'string',
          id: 79
        },
        inst_type: {
          type: 'string',
          id: 80
        },
        from_draft: {
          type: 'bool',
          id: 81,
          options: {
            proto3_optional: true
          }
        },
        reviewer_id: {
          type: 'string',
          id: 82,
          options: {
            proto3_optional: true
          }
        },
        review_status: {
          type: 'ReviewStatusEnum',
          id: 83
        },
        inst_listed_type: {
          type: 'string',
          id: 84
        },
        quote_type: {
          type: 'BondQuoteTypeEnum',
          id: 85
        },
        bond_category: {
          type: 'BondCategoryEnum',
          id: 86
        },
        bond_sector: {
          type: 'BondSectorEnum',
          id: 87
        },
        fr_type: {
          type: 'FRTypeEnum',
          id: 88
        },
        perp_type: {
          type: 'PerpTypeEnum',
          id: 89
        },
        has_option: {
          type: 'bool',
          id: 90
        },
        flag_recommend: {
          type: 'bool',
          id: 91,
          options: {
            proto3_optional: true
          }
        },
        inst_rating: {
          type: 'RatingEnum',
          id: 92
        },
        implied_rating: {
          type: 'RatingEnum',
          id: 93
        }
      }
    },
    BondQuoteHandicapStruct: {
      oneofs: {
        _bid_quote_total: {
          oneof: ['bid_quote_total']
        },
        _ofr_quote_total: {
          oneof: ['ofr_quote_total']
        },
        _bid_handicap: {
          oneof: ['bid_handicap']
        },
        _ofr_handicap: {
          oneof: ['ofr_handicap']
        }
      },
      fields: {
        key_market: {
          type: 'string',
          id: 1
        },
        bid_quote_list: {
          rule: 'repeated',
          type: 'QuoteHandicapStruct',
          id: 2
        },
        ofr_quote_list: {
          rule: 'repeated',
          type: 'QuoteHandicapStruct',
          id: 3
        },
        bid_quote_total: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        ofr_quote_total: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        bid_handicap: {
          type: 'double',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        ofr_handicap: {
          type: 'double',
          id: 7,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    QuoteHandicapStruct: {
      oneofs: {
        _price: {
          oneof: ['price']
        },
        _yield: {
          oneof: ['yield']
        },
        _clean_price: {
          oneof: ['clean_price']
        },
        _full_price: {
          oneof: ['full_price']
        },
        _spread: {
          oneof: ['spread']
        },
        _volume: {
          oneof: ['volume']
        },
        _flag_rebate: {
          oneof: ['flag_rebate']
        },
        _return_point: {
          oneof: ['return_point']
        },
        _flag_intention: {
          oneof: ['flag_intention']
        },
        _refer_type: {
          oneof: ['refer_type']
        },
        _comment: {
          oneof: ['comment']
        },
        _flag_stock_exchange: {
          oneof: ['flag_stock_exchange']
        },
        _flag_bilateral: {
          oneof: ['flag_bilateral']
        },
        _flag_request: {
          oneof: ['flag_request']
        },
        _flag_indivisible: {
          oneof: ['flag_indivisible']
        },
        _flag_internal: {
          oneof: ['flag_internal']
        },
        _flag_urgent: {
          oneof: ['flag_urgent']
        },
        _flag_exchange: {
          oneof: ['flag_exchange']
        },
        _flag_star: {
          oneof: ['flag_star']
        },
        _flag_oco: {
          oneof: ['flag_oco']
        },
        _flag_package: {
          oneof: ['flag_package']
        },
        _flag_recommend: {
          oneof: ['flag_recommend']
        },
        _is_exercise: {
          oneof: ['is_exercise']
        },
        _almost_done: {
          oneof: ['almost_done']
        },
        _flag_stc: {
          oneof: ['flag_stc']
        },
        _trader_tag: {
          oneof: ['trader_tag']
        },
        _exercise_manual: {
          oneof: ['exercise_manual']
        },
        _delivery_date: {
          oneof: ['delivery_date']
        },
        _traded_date: {
          oneof: ['traded_date']
        },
        _settlement_date: {
          oneof: ['settlement_date']
        }
      },
      fields: {
        quote_id: {
          type: 'string',
          id: 1
        },
        key_market: {
          type: 'string',
          id: 2
        },
        broker_id: {
          type: 'string',
          id: 3
        },
        trader_id: {
          type: 'string',
          id: 4
        },
        product_type: {
          type: 'ProductTypeEnum',
          id: 5
        },
        side: {
          type: 'SideEnum',
          id: 6
        },
        quote_type: {
          type: 'BondQuoteTypeEnum',
          id: 7
        },
        price: {
          type: 'double',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        yield: {
          type: 'double',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        clean_price: {
          type: 'double',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        full_price: {
          type: 'double',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        spread: {
          type: 'double',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        volume: {
          type: 'double',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        flag_rebate: {
          type: 'bool',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        return_point: {
          type: 'double',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        flag_intention: {
          type: 'bool',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        liquidation_speed_list: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 17
        },
        refer_type: {
          type: 'RefTypeEnum',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        comment: {
          type: 'string',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        flag_stock_exchange: {
          type: 'bool',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        flag_bilateral: {
          type: 'bool',
          id: 21,
          options: {
            proto3_optional: true
          }
        },
        flag_request: {
          type: 'bool',
          id: 22,
          options: {
            proto3_optional: true
          }
        },
        flag_indivisible: {
          type: 'bool',
          id: 23,
          options: {
            proto3_optional: true
          }
        },
        flag_internal: {
          type: 'bool',
          id: 24,
          options: {
            proto3_optional: true
          }
        },
        flag_urgent: {
          type: 'bool',
          id: 25,
          options: {
            proto3_optional: true
          }
        },
        flag_exchange: {
          type: 'bool',
          id: 26,
          options: {
            proto3_optional: true
          }
        },
        flag_star: {
          type: 'int32',
          id: 27,
          options: {
            proto3_optional: true
          }
        },
        flag_oco: {
          type: 'bool',
          id: 28,
          options: {
            proto3_optional: true
          }
        },
        flag_package: {
          type: 'bool',
          id: 29,
          options: {
            proto3_optional: true
          }
        },
        flag_recommend: {
          type: 'bool',
          id: 30,
          options: {
            proto3_optional: true
          }
        },
        is_exercise: {
          type: 'bool',
          id: 31,
          options: {
            proto3_optional: true
          }
        },
        almost_done: {
          type: 'bool',
          id: 32,
          options: {
            proto3_optional: true
          }
        },
        flag_stc: {
          type: 'bool',
          id: 33,
          options: {
            proto3_optional: true
          }
        },
        inst_id: {
          type: 'string',
          id: 34
        },
        inst_name: {
          type: 'string',
          id: 35
        },
        trader_name: {
          type: 'string',
          id: 36
        },
        trader_tag: {
          type: 'string',
          id: 37,
          options: {
            proto3_optional: true
          }
        },
        exercise_manual: {
          type: 'bool',
          id: 38,
          options: {
            proto3_optional: true
          }
        },
        code_market: {
          type: 'string',
          id: 39
        },
        delivery_date: {
          type: 'string',
          id: 40,
          options: {
            proto3_optional: true
          }
        },
        traded_date: {
          type: 'string',
          id: 41,
          options: {
            proto3_optional: true
          }
        },
        settlement_date: {
          type: 'string',
          id: 42,
          options: {
            proto3_optional: true
          }
        },
        update_time: {
          type: 'string',
          id: 43
        }
      }
    },
    FiccBondStruct: {
      oneofs: {
        _create_time: {
          oneof: ['create_time']
        },
        _update_time: {
          oneof: ['update_time']
        },
        _issue_rate: {
          oneof: ['issue_rate']
        },
        _repayment_method: {
          oneof: ['repayment_method']
        },
        _issuer_info: {
          oneof: ['issuer_info']
        }
      },
      fields: {
        ficc_id: {
          type: 'string',
          id: 1
        },
        enable: {
          type: 'EnableEnum',
          id: 2
        },
        create_time: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        update_time: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        product_class: {
          type: 'ProductClassEnum',
          id: 5
        },
        product_type: {
          type: 'ProductTypeEnum',
          id: 6
        },
        product_key: {
          type: 'string',
          id: 7
        },
        product_code: {
          type: 'string',
          id: 8
        },
        product_name: {
          type: 'string',
          id: 9
        },
        bond_ficc_type: {
          type: 'string',
          id: 10
        },
        key_market: {
          type: 'string',
          id: 11
        },
        code_market: {
          type: 'string',
          id: 12
        },
        bond_code: {
          type: 'string',
          id: 13
        },
        bond_key: {
          type: 'string',
          id: 14
        },
        listed_market: {
          type: 'string',
          id: 15
        },
        listed_date: {
          type: 'string',
          id: 16
        },
        delisted_date: {
          type: 'string',
          id: 17
        },
        full_name: {
          type: 'string',
          id: 18
        },
        short_name: {
          type: 'string',
          id: 19
        },
        pinyin: {
          type: 'string',
          id: 20
        },
        pinyin_full: {
          type: 'string',
          id: 21
        },
        selective_code: {
          type: 'string',
          id: 22
        },
        selective_name: {
          type: 'string',
          id: 23
        },
        ficc_type_code: {
          type: 'string',
          id: 24
        },
        ficc_belong: {
          type: 'string',
          id: 25
        },
        val_yield_exe: {
          type: 'double',
          id: 26
        },
        val_yield_mat: {
          type: 'double',
          id: 27
        },
        val_clean_price_exe: {
          type: 'double',
          id: 28
        },
        val_clean_price_mat: {
          type: 'double',
          id: 29
        },
        val_full_price_exe: {
          type: 'double',
          id: 30
        },
        val_modified_duration: {
          type: 'double',
          id: 31
        },
        val_convexity: {
          type: 'double',
          id: 32
        },
        val_basis_point_value: {
          type: 'double',
          id: 33
        },
        remaining_par_value: {
          type: 'double',
          id: 34
        },
        csi_yield_to_maturity: {
          type: 'double',
          id: 35
        },
        csi_modified_duration: {
          type: 'double',
          id: 36
        },
        csi_clean_price: {
          type: 'double',
          id: 37
        },
        csi_clean_price_exe: {
          type: 'double',
          id: 38
        },
        csi_clean_price_mat: {
          type: 'double',
          id: 39
        },
        csi_yield_exe: {
          type: 'double',
          id: 40
        },
        csi_yield_mat: {
          type: 'double',
          id: 41
        },
        csi_full_price_exe: {
          type: 'double',
          id: 42
        },
        csi_full_price_mat: {
          type: 'double',
          id: 43
        },
        is_cross_mkt: {
          type: 'bool',
          id: 44
        },
        is_mortgage: {
          type: 'bool',
          id: 45
        },
        is_municipal: {
          type: 'bool',
          id: 46
        },
        mkt_type: {
          type: 'MktTypeEnum',
          id: 47
        },
        issuer_rating_npy: {
          type: 'string',
          id: 48
        },
        rating_npy: {
          type: 'string',
          id: 49
        },
        issuer_rating: {
          type: 'string',
          id: 50
        },
        maturity_term: {
          type: 'double',
          id: 51
        },
        warranter: {
          type: 'string',
          id: 52
        },
        coupon_type: {
          type: 'string',
          id: 53
        },
        rating_augment: {
          type: 'string',
          id: 54
        },
        rating_date: {
          type: 'string',
          id: 55
        },
        option_type: {
          type: 'OptionTypeEnum',
          id: 56
        },
        coupon_rate_current: {
          type: 'double',
          id: 57
        },
        maturity_date: {
          type: 'string',
          id: 58
        },
        first_maturity_date: {
          type: 'string',
          id: 59
        },
        maturity_is_holiday: {
          type: 'bool',
          id: 60
        },
        issuer_code: {
          type: 'string',
          id: 61
        },
        next_coupon_date: {
          type: 'string',
          id: 62
        },
        redemption_no: {
          type: 'int32',
          id: 63
        },
        rating: {
          type: 'string',
          id: 64
        },
        frn_index_id: {
          type: 'string',
          id: 65
        },
        fixing_ma_days: {
          type: 'int32',
          id: 66
        },
        coupon_rate_spread: {
          type: 'double',
          id: 67
        },
        option_date: {
          type: 'string',
          id: 68
        },
        issue_amount: {
          type: 'double',
          id: 69
        },
        underwriter_code: {
          type: 'string',
          id: 70
        },
        issuer_rating_inst_code: {
          type: 'string',
          id: 71
        },
        term_unit: {
          type: 'string',
          id: 72
        },
        rating_inst_code: {
          type: 'string',
          id: 73
        },
        interest_start_date: {
          type: 'string',
          id: 74
        },
        issue_year: {
          type: 'int32',
          id: 75
        },
        ent_cor: {
          type: 'string',
          id: 76
        },
        issue_rate: {
          type: 'double',
          id: 77,
          options: {
            proto3_optional: true
          }
        },
        asset_status: {
          type: 'string',
          id: 78
        },
        auction_date_start: {
          type: 'string',
          id: 79
        },
        auction_date_end: {
          type: 'string',
          id: 80
        },
        call_str: {
          type: 'string',
          id: 81
        },
        put_str: {
          type: 'string',
          id: 82
        },
        sceniority: {
          type: 'string',
          id: 83
        },
        compensate_rate: {
          type: 'string',
          id: 84
        },
        issuer_outlook_current: {
          type: 'OutlookEnum',
          id: 85
        },
        bond_category: {
          type: 'BondCategoryEnum',
          id: 86
        },
        bond_sector: {
          type: 'BondSectorEnum',
          id: 87
        },
        fr_type: {
          type: 'FRTypeEnum',
          id: 88
        },
        perp_type: {
          type: 'PerpTypeEnum',
          id: 89
        },
        has_option: {
          type: 'bool',
          id: 90
        },
        time_to_maturity: {
          type: 'string',
          id: 91
        },
        rest_day_to_workday: {
          type: 'RestDayToWorkdayStruct',
          id: 92
        },
        is_fixed_rate: {
          type: 'bool',
          id: 93
        },
        option_style: {
          type: 'string',
          id: 94
        },
        conversion_rate: {
          type: 'double',
          id: 95
        },
        fund_objective_category: {
          type: 'string',
          id: 96
        },
        fund_objective_sub_category: {
          type: 'string',
          id: 97
        },
        implied_rating: {
          type: 'string',
          id: 98
        },
        cbc_rating: {
          type: 'string',
          id: 99
        },
        bond_cross_mkt_list: {
          rule: 'repeated',
          type: 'BondCrossMktStruct',
          id: 100
        },
        repayment_method: {
          type: 'RepaymentMethodEnum',
          id: 101,
          options: {
            proto3_optional: true
          }
        },
        warrant_method: {
          type: 'string',
          id: 102
        },
        issuer_info: {
          type: 'IssuerStruct',
          id: 103,
          options: {
            proto3_optional: true
          }
        },
        with_warranty: {
          type: 'bool',
          id: 104
        },
        display_code: {
          type: 'string',
          id: 105
        }
      }
    },
    RestDayToWorkdayStruct: {
      oneofs: {
        _days_cib: {
          oneof: ['days_cib']
        },
        _days_sse: {
          oneof: ['days_sse']
        },
        _days_sze: {
          oneof: ['days_sze']
        }
      },
      fields: {
        days_cib: {
          type: 'int32',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        days_sse: {
          type: 'int32',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        days_sze: {
          type: 'int32',
          id: 3,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    FiccBasicBondAppendixStruct: {
      oneofs: {
        _issue_rate: {
          oneof: ['issue_rate']
        }
      },
      fields: {
        ficc_id: {
          type: 'string',
          id: 1
        },
        enable: {
          type: 'EnableEnum',
          id: 2
        },
        create_time: {
          type: 'string',
          id: 3
        },
        update_time: {
          type: 'string',
          id: 4
        },
        product_class: {
          type: 'ProductClassEnum',
          id: 5
        },
        product_type: {
          type: 'string',
          id: 6
        },
        product_key: {
          type: 'string',
          id: 7
        },
        product_code: {
          type: 'string',
          id: 8
        },
        product_name: {
          type: 'string',
          id: 9
        },
        bond_ficc_type: {
          type: 'string',
          id: 10
        },
        key_market: {
          type: 'string',
          id: 11
        },
        code_market: {
          type: 'string',
          id: 12
        },
        bond_code: {
          type: 'string',
          id: 13
        },
        bond_key: {
          type: 'string',
          id: 14
        },
        listed_market: {
          type: 'string',
          id: 15
        },
        listed_date: {
          type: 'string',
          id: 16
        },
        delisted_date: {
          type: 'string',
          id: 17
        },
        full_name: {
          type: 'string',
          id: 18
        },
        short_name: {
          type: 'string',
          id: 19
        },
        pinyin: {
          type: 'string',
          id: 20
        },
        pinyin_full: {
          type: 'string',
          id: 21
        },
        selective_code: {
          type: 'string',
          id: 22
        },
        selective_name: {
          type: 'string',
          id: 23
        },
        ficc_type_code: {
          type: 'string',
          id: 24
        },
        ficc_belong: {
          type: 'string',
          id: 25
        },
        val_yield: {
          type: 'double',
          id: 26
        },
        val_yield_unrec: {
          type: 'double',
          id: 27
        },
        val_net_price: {
          type: 'double',
          id: 28
        },
        val_net_price_unrec: {
          type: 'double',
          id: 29
        },
        val_full_price: {
          type: 'double',
          id: 30
        },
        val_full_price_unrec: {
          type: 'double',
          id: 31
        },
        val_modified_duration: {
          type: 'double',
          id: 32
        },
        val_convexity: {
          type: 'double',
          id: 33
        },
        val_basis_point_value: {
          type: 'double',
          id: 34
        },
        remaining_year: {
          type: 'double',
          id: 35
        },
        remaining_year_unrec: {
          type: 'double',
          id: 36
        },
        val_accrued_interest: {
          type: 'double',
          id: 37
        },
        val_accrued_interest_unrec: {
          type: 'double',
          id: 38
        },
        val_closed_dirty_price: {
          type: 'double',
          id: 39
        },
        val_closed_dirty_price_unrec: {
          type: 'double',
          id: 40
        },
        val_closed_accrued_interest: {
          type: 'double',
          id: 41
        },
        val_closed_accrued_interest_unrec: {
          type: 'double',
          id: 42
        },
        remaining_par_value: {
          type: 'double',
          id: 43
        },
        remaining_par_value_unrec: {
          type: 'double',
          id: 44
        },
        cdc_date: {
          type: 'string',
          id: 45
        },
        valuation_date: {
          type: 'string',
          id: 46
        },
        csi_calculation_price: {
          type: 'double',
          id: 47
        },
        csi_yield_to_maturity: {
          type: 'double',
          id: 48
        },
        csi_modified_duration: {
          type: 'double',
          id: 49
        },
        csi_convexity: {
          type: 'double',
          id: 50
        },
        csi_clean_price: {
          type: 'double',
          id: 51
        },
        csi_accrued_interest: {
          type: 'double',
          id: 52
        },
        csi_full_price_maturity: {
          type: 'double',
          id: 53
        },
        csi_clean_price_maturity: {
          type: 'double',
          id: 54
        },
        csi_yld_to_maturity: {
          type: 'double',
          id: 55
        },
        csi_modified_duration_maturity: {
          type: 'double',
          id: 56
        },
        csi_convexity_maturity: {
          type: 'double',
          id: 57
        },
        csi_full_price_exercise: {
          type: 'double',
          id: 58
        },
        csi_clean_price_exercise: {
          type: 'double',
          id: 59
        },
        csi_yld_to_exercise: {
          type: 'double',
          id: 60
        },
        csi_modified_duration_exercise: {
          type: 'double',
          id: 61
        },
        csi_convexity_exercise: {
          type: 'double',
          id: 62
        },
        csi_recommendation: {
          type: 'bool',
          id: 63
        },
        csi_estimated_coupon: {
          type: 'double',
          id: 64
        },
        inputer: {
          type: 'string',
          id: 65
        },
        checker: {
          type: 'string',
          id: 66
        },
        country: {
          type: 'string',
          id: 67
        },
        currency: {
          type: 'string',
          id: 68
        },
        isin: {
          type: 'string',
          id: 69
        },
        issuer_code: {
          type: 'string',
          id: 70
        },
        underwriter_code: {
          type: 'string',
          id: 71
        },
        bond_type: {
          type: 'string',
          id: 72
        },
        external_type: {
          type: 'string',
          id: 73
        },
        maturity_term_y: {
          type: 'double',
          id: 74
        },
        maturity_term: {
          type: 'double',
          id: 75
        },
        term_unit: {
          type: 'string',
          id: 76
        },
        interest_start_date: {
          type: 'string',
          id: 77
        },
        maturity_date: {
          type: 'string',
          id: 78
        },
        maturity_is_holiday: {
          type: 'DateIsHolidayEnum',
          id: 79
        },
        first_coupon_date: {
          type: 'string',
          id: 80
        },
        next_coupon_date: {
          type: 'string',
          id: 81
        },
        announce_date: {
          type: 'string',
          id: 82
        },
        issue_start_date: {
          type: 'string',
          id: 83
        },
        issue_end_date: {
          type: 'string',
          id: 84
        },
        wi_start_date: {
          type: 'string',
          id: 85
        },
        wi_end_date: {
          type: 'string',
          id: 86
        },
        dist_date_start: {
          type: 'string',
          id: 87
        },
        dist_date_end: {
          type: 'string',
          id: 88
        },
        auction_date_start: {
          type: 'string',
          id: 89
        },
        auction_date_end: {
          type: 'string',
          id: 90
        },
        payment_date: {
          type: 'string',
          id: 91
        },
        register: {
          type: 'string',
          id: 92
        },
        option_type: {
          type: 'string',
          id: 93
        },
        option_style: {
          type: 'string',
          id: 94
        },
        option_date: {
          type: 'string',
          id: 95
        },
        call_no: {
          type: 'int32',
          id: 96
        },
        call_str: {
          type: 'string',
          id: 97
        },
        put_no: {
          type: 'int32',
          id: 98
        },
        put_str: {
          type: 'string',
          id: 99
        },
        compensate_rate: {
          type: 'string',
          id: 100
        },
        compensate_from: {
          type: 'string',
          id: 101
        },
        option_exercise: {
          type: 'string',
          id: 102
        },
        option_exercise_date: {
          type: 'string',
          id: 103
        },
        coupon_type: {
          type: 'string',
          id: 105
        },
        coupon_rate_spread: {
          type: 'double',
          id: 106
        },
        coupon_rate_current: {
          type: 'double',
          id: 107
        },
        coupon_frequency: {
          type: 'string',
          id: 108
        },
        compound_frequency: {
          type: 'string',
          id: 109
        },
        interest_basis: {
          type: 'string',
          id: 110
        },
        coupon_dist: {
          type: 'string',
          id: 111
        },
        frn_multiplier: {
          type: 'double',
          id: 112
        },
        frn_index_id: {
          type: 'string',
          id: 113
        },
        first_index_rate: {
          type: 'string',
          id: 114
        },
        fixing_frequency: {
          type: 'string',
          id: 115
        },
        fixing_ma_days: {
          type: 'int32',
          id: 116
        },
        fixing_preceds: {
          type: 'string',
          id: 117
        },
        fixing_calendar_key: {
          type: 'string',
          id: 118
        },
        fixing_tailing: {
          type: 'string',
          id: 119
        },
        fixing_digit: {
          type: 'int32',
          id: 120
        },
        reset_effective: {
          type: 'string',
          id: 121
        },
        simple_compound: {
          type: 'string',
          id: 122
        },
        issue_reference_desc: {
          type: 'string',
          id: 123
        },
        variable_schedule: {
          type: 'string',
          id: 124
        },
        coupon_day_adjust: {
          type: 'string',
          id: 125
        },
        coupon_day_dmc: {
          type: 'string',
          id: 126
        },
        coupon_calendar_key: {
          type: 'string',
          id: 127
        },
        pricing_conv: {
          type: 'string',
          id: 128
        },
        issue_price: {
          type: 'double',
          id: 129
        },
        issue_rate: {
          type: 'double',
          id: 130,
          options: {
            proto3_optional: true
          }
        },
        planned_issue_amount: {
          type: 'double',
          id: 131
        },
        first_issue_amount: {
          type: 'double',
          id: 132
        },
        issue_amount: {
          type: 'double',
          id: 133
        },
        redemption_no: {
          type: 'int32',
          id: 134
        },
        redemption_str: {
          type: 'string',
          id: 135
        },
        maturity_adjust: {
          type: 'string',
          id: 136
        },
        maturity_dmc: {
          type: 'string',
          id: 137
        },
        maturity_calendar_key: {
          type: 'string',
          id: 138
        },
        sceniority: {
          type: 'string',
          id: 139
        },
        rating_current: {
          type: 'RatingEnum',
          id: 140
        },
        rating_institution_code: {
          type: 'string',
          id: 141
        },
        rating_date: {
          type: 'string',
          id: 142
        },
        rating_augment: {
          type: 'string',
          id: 143
        },
        warranter: {
          type: 'string',
          id: 144
        },
        warrant_note: {
          type: 'string',
          id: 145
        },
        issuer_rating_current: {
          type: 'RatingEnum',
          id: 146
        },
        issuer_rating_institution_code: {
          type: 'string',
          id: 147
        },
        issuer_rating_date: {
          type: 'string',
          id: 148
        },
        issue_commission_rate: {
          type: 'string',
          id: 149
        },
        redm_commission_rate: {
          type: 'string',
          id: 150
        },
        issue_year: {
          type: 'int32',
          id: 151
        },
        issue_no: {
          type: 'int32',
          id: 152
        },
        quotation: {
          type: 'string',
          id: 153
        },
        asset_status: {
          type: 'string',
          id: 154
        },
        purpose_of_issue: {
          type: 'string',
          id: 155
        },
        first_issueKey: {
          type: 'string',
          id: 156
        },
        note: {
          type: 'string',
          id: 157
        },
        term_structure: {
          type: 'string',
          id: 158
        },
        p_rating_current: {
          type: 'RatingEnum',
          id: 159
        },
        p_issuer_rating_current: {
          type: 'RatingEnum',
          id: 160
        },
        is_crossMkt: {
          type: 'IsCrossMktEnum',
          id: 171
        },
        is_mortgage: {
          type: 'IsMortgageEnum',
          id: 172
        },
        mkt_type: {
          type: 'MktTypeEnum',
          id: 173
        },
        ann_status: {
          type: 'int32',
          id: 174
        },
        liquidity_supporter: {
          type: 'string',
          id: 175
        },
        outstanding_amount: {
          type: 'double',
          id: 176
        },
        is_cib: {
          type: 'int32',
          id: 177
        },
        yield_curve_type: {
          type: 'string',
          id: 178
        },
        is_municipal: {
          type: 'int32',
          id: 179
        },
        issuer_rating_current_npy: {
          type: 'RatingEnum',
          id: 180
        },
        rating_current_npy: {
          type: 'RatingEnum',
          id: 181
        },
        issuer_outlook_current: {
          type: 'string',
          id: 182
        },
        p_issuer_outlook_current: {
          type: 'string',
          id: 183
        },
        short_name_en: {
          type: 'string',
          id: 184
        },
        full_name_en: {
          type: 'string',
          id: 185
        },
        bid_limit_bottom: {
          type: 'double',
          id: 186
        },
        bid_limit_top: {
          type: 'double',
          id: 187
        },
        issue_end_time: {
          type: 'string',
          id: 188
        },
        ent_co: {
          type: 'string',
          id: 189
        },
        conversion_rate: {
          type: 'double',
          id: 190
        },
        underwriter_group: {
          type: 'string',
          id: 191
        },
        repayment_method: {
          type: 'RepaymentMethodEnum',
          id: 192
        }
      }
    },
    FiccBondBasicStruct: {
      oneofs: {
        _listed_date: {
          oneof: ['listed_date']
        },
        _delisted_date: {
          oneof: ['delisted_date']
        },
        _has_option: {
          oneof: ['has_option']
        },
        _option_type: {
          oneof: ['option_type']
        },
        _option_date: {
          oneof: ['option_date']
        },
        _conversion_rate: {
          oneof: ['conversion_rate']
        },
        _fund_objective_sub_category: {
          oneof: ['fund_objective_sub_category']
        },
        _fund_objective_category: {
          oneof: ['fund_objective_category']
        },
        _maturity_date: {
          oneof: ['maturity_date']
        },
        _maturity_is_holiday: {
          oneof: ['maturity_is_holiday']
        },
        _time_to_maturity: {
          oneof: ['time_to_maturity']
        },
        _rest_day_to_workday: {
          oneof: ['rest_day_to_workday']
        },
        _redemption_no: {
          oneof: ['redemption_no']
        },
        _val_yield_exe: {
          oneof: ['val_yield_exe']
        },
        _val_yield_mat: {
          oneof: ['val_yield_mat']
        },
        _val_clean_price_exe: {
          oneof: ['val_clean_price_exe']
        },
        _val_clean_price_mat: {
          oneof: ['val_clean_price_mat']
        },
        _val_modified_duration: {
          oneof: ['val_modified_duration']
        },
        _val_basis_point_value: {
          oneof: ['val_basis_point_value']
        },
        _csi_yield_exe: {
          oneof: ['csi_yield_exe']
        },
        _csi_yield_mat: {
          oneof: ['csi_yield_mat']
        },
        _csi_clean_price_exe: {
          oneof: ['csi_clean_price_exe']
        },
        _csi_clean_price_mat: {
          oneof: ['csi_clean_price_mat']
        },
        _csi_full_price_exe: {
          oneof: ['csi_full_price_exe']
        },
        _csi_full_price_mat: {
          oneof: ['csi_full_price_mat']
        },
        _rating: {
          oneof: ['rating']
        },
        _implied_rating: {
          oneof: ['implied_rating']
        },
        _cbc_rating: {
          oneof: ['cbc_rating']
        },
        _issuer_rating: {
          oneof: ['issuer_rating']
        },
        _issue_rate: {
          oneof: ['issue_rate']
        },
        _issue_amount: {
          oneof: ['issue_amount']
        },
        _interest_start_date: {
          oneof: ['interest_start_date']
        },
        _next_coupon_date: {
          oneof: ['next_coupon_date']
        },
        _coupon_rate_current: {
          oneof: ['coupon_rate_current']
        },
        _first_maturity_date: {
          oneof: ['first_maturity_date']
        }
      },
      fields: {
        key_market: {
          type: 'string',
          id: 1
        },
        bond_key: {
          type: 'string',
          id: 2
        },
        bond_code: {
          type: 'string',
          id: 3
        },
        code_market: {
          type: 'string',
          id: 4
        },
        display_code: {
          type: 'string',
          id: 5
        },
        product_type: {
          type: 'ProductTypeEnum',
          id: 6
        },
        listed_market: {
          type: 'string',
          id: 7
        },
        listed_date: {
          type: 'string',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        delisted_date: {
          type: 'string',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        short_name: {
          type: 'string',
          id: 10
        },
        bond_category: {
          type: 'BondCategoryEnum',
          id: 11
        },
        fr_type: {
          type: 'FRTypeEnum',
          id: 12
        },
        is_fixed_rate: {
          type: 'bool',
          id: 13
        },
        perp_type: {
          type: 'PerpTypeEnum',
          id: 14
        },
        has_option: {
          type: 'bool',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        option_type: {
          type: 'string',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        option_date: {
          type: 'string',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        conversion_rate: {
          type: 'double',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        fund_objective_sub_category: {
          type: 'string',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        fund_objective_category: {
          type: 'string',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        with_warranty: {
          type: 'bool',
          id: 21
        },
        is_cross_mkt: {
          type: 'bool',
          id: 22
        },
        mkt_type: {
          type: 'MktTypeEnum',
          id: 23
        },
        maturity_date: {
          type: 'string',
          id: 24,
          options: {
            proto3_optional: true
          }
        },
        maturity_is_holiday: {
          type: 'bool',
          id: 25,
          options: {
            proto3_optional: true
          }
        },
        time_to_maturity: {
          type: 'string',
          id: 26,
          options: {
            proto3_optional: true
          }
        },
        rest_day_to_workday: {
          type: 'RestDayToWorkdayStruct',
          id: 27,
          options: {
            proto3_optional: true
          }
        },
        redemption_no: {
          type: 'int32',
          id: 28,
          options: {
            proto3_optional: true
          }
        },
        val_yield_exe: {
          type: 'double',
          id: 29,
          options: {
            proto3_optional: true
          }
        },
        val_yield_mat: {
          type: 'double',
          id: 30,
          options: {
            proto3_optional: true
          }
        },
        val_clean_price_exe: {
          type: 'double',
          id: 31,
          options: {
            proto3_optional: true
          }
        },
        val_clean_price_mat: {
          type: 'double',
          id: 32,
          options: {
            proto3_optional: true
          }
        },
        val_modified_duration: {
          type: 'double',
          id: 33,
          options: {
            proto3_optional: true
          }
        },
        val_basis_point_value: {
          type: 'double',
          id: 34,
          options: {
            proto3_optional: true
          }
        },
        csi_yield_exe: {
          type: 'double',
          id: 35,
          options: {
            proto3_optional: true
          }
        },
        csi_yield_mat: {
          type: 'double',
          id: 36,
          options: {
            proto3_optional: true
          }
        },
        csi_clean_price_exe: {
          type: 'double',
          id: 37,
          options: {
            proto3_optional: true
          }
        },
        csi_clean_price_mat: {
          type: 'double',
          id: 38,
          options: {
            proto3_optional: true
          }
        },
        csi_full_price_exe: {
          type: 'double',
          id: 39,
          options: {
            proto3_optional: true
          }
        },
        csi_full_price_mat: {
          type: 'double',
          id: 40,
          options: {
            proto3_optional: true
          }
        },
        rating: {
          type: 'string',
          id: 41,
          options: {
            proto3_optional: true
          }
        },
        implied_rating: {
          type: 'string',
          id: 42,
          options: {
            proto3_optional: true
          }
        },
        cbc_rating: {
          type: 'string',
          id: 43,
          options: {
            proto3_optional: true
          }
        },
        issuer_rating: {
          type: 'string',
          id: 44,
          options: {
            proto3_optional: true
          }
        },
        issue_rate: {
          type: 'double',
          id: 45,
          options: {
            proto3_optional: true
          }
        },
        issue_amount: {
          type: 'double',
          id: 46,
          options: {
            proto3_optional: true
          }
        },
        repayment_method: {
          type: 'RepaymentMethodEnum',
          id: 47
        },
        interest_start_date: {
          type: 'string',
          id: 48,
          options: {
            proto3_optional: true
          }
        },
        next_coupon_date: {
          type: 'string',
          id: 49,
          options: {
            proto3_optional: true
          }
        },
        coupon_rate_current: {
          type: 'double',
          id: 50,
          options: {
            proto3_optional: true
          }
        },
        issuer_code: {
          type: 'string',
          id: 51
        },
        first_maturity_date: {
          type: 'string',
          id: 52,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    FiccBondDetailStruct: {
      oneofs: {
        _listed_date: {
          oneof: ['listed_date']
        },
        _delisted_date: {
          oneof: ['delisted_date']
        },
        _has_option: {
          oneof: ['has_option']
        },
        _option_type: {
          oneof: ['option_type']
        },
        _option_date: {
          oneof: ['option_date']
        },
        _term_structure: {
          oneof: ['term_structure']
        },
        _conversion_rate: {
          oneof: ['conversion_rate']
        },
        _fund_objective_sub_category: {
          oneof: ['fund_objective_sub_category']
        },
        _fund_objective_category: {
          oneof: ['fund_objective_category']
        },
        _is_gn: {
          oneof: ['is_gn']
        },
        _ncd_subtype: {
          oneof: ['ncd_subtype']
        },
        _rating_augment: {
          oneof: ['rating_augment']
        },
        _warranter: {
          oneof: ['warranter']
        },
        _warrant_method: {
          oneof: ['warrant_method']
        },
        _warrant_note: {
          oneof: ['warrant_note']
        },
        _asset_status: {
          oneof: ['asset_status']
        },
        _ent_cor: {
          oneof: ['ent_cor']
        },
        _maturity_date: {
          oneof: ['maturity_date']
        },
        _maturity_is_holiday: {
          oneof: ['maturity_is_holiday']
        },
        _time_to_maturity: {
          oneof: ['time_to_maturity']
        },
        _first_maturity_date: {
          oneof: ['first_maturity_date']
        },
        _rest_day_to_workday: {
          oneof: ['rest_day_to_workday']
        },
        _redemption_no: {
          oneof: ['redemption_no']
        },
        _sceniority: {
          oneof: ['sceniority']
        },
        _liquidity_supporter: {
          oneof: ['liquidity_supporter']
        },
        _val_yield_exe: {
          oneof: ['val_yield_exe']
        },
        _val_yield_mat: {
          oneof: ['val_yield_mat']
        },
        _val_clean_price_exe: {
          oneof: ['val_clean_price_exe']
        },
        _val_clean_price_mat: {
          oneof: ['val_clean_price_mat']
        },
        _val_full_price_exe: {
          oneof: ['val_full_price_exe']
        },
        _val_full_price_mat: {
          oneof: ['val_full_price_mat']
        },
        _val_modified_duration: {
          oneof: ['val_modified_duration']
        },
        _val_convexity: {
          oneof: ['val_convexity']
        },
        _val_basis_point_value: {
          oneof: ['val_basis_point_value']
        },
        _csi_yield_exe: {
          oneof: ['csi_yield_exe']
        },
        _csi_yield_mat: {
          oneof: ['csi_yield_mat']
        },
        _csi_clean_price_exe: {
          oneof: ['csi_clean_price_exe']
        },
        _csi_clean_price_mat: {
          oneof: ['csi_clean_price_mat']
        },
        _csi_full_price_exe: {
          oneof: ['csi_full_price_exe']
        },
        _csi_full_price_mat: {
          oneof: ['csi_full_price_mat']
        },
        _rating: {
          oneof: ['rating']
        },
        _rating_inst_code: {
          oneof: ['rating_inst_code']
        },
        _rating_date: {
          oneof: ['rating_date']
        },
        _implied_rating: {
          oneof: ['implied_rating']
        },
        _cbc_rating: {
          oneof: ['cbc_rating']
        },
        _issuer_rating: {
          oneof: ['issuer_rating']
        },
        _issuer_rating_inst_code: {
          oneof: ['issuer_rating_inst_code']
        },
        _issuer_rating_date: {
          oneof: ['issuer_rating_date']
        },
        _issuer_outlook_current: {
          oneof: ['issuer_outlook_current']
        },
        _issue_price: {
          oneof: ['issue_price']
        },
        _issue_rate: {
          oneof: ['issue_rate']
        },
        _issue_amount: {
          oneof: ['issue_amount']
        },
        _issue_start_date: {
          oneof: ['issue_start_date']
        },
        _issue_end_date: {
          oneof: ['issue_end_date']
        },
        _underwriter_code: {
          oneof: ['underwriter_code']
        },
        _underwriter_group: {
          oneof: ['underwriter_group']
        },
        _maturity_term: {
          oneof: ['maturity_term']
        },
        _term_unit: {
          oneof: ['term_unit']
        },
        _interest_start_date: {
          oneof: ['interest_start_date']
        },
        _first_coupon_date: {
          oneof: ['first_coupon_date']
        },
        _next_coupon_date: {
          oneof: ['next_coupon_date']
        },
        _call_str: {
          oneof: ['call_str']
        },
        _put_str: {
          oneof: ['put_str']
        },
        _coupon_type: {
          oneof: ['coupon_type']
        },
        _coupon_rate_spread: {
          oneof: ['coupon_rate_spread']
        },
        _coupon_rate_current: {
          oneof: ['coupon_rate_current']
        },
        _coupon_frequency: {
          oneof: ['coupon_frequency']
        },
        _frn_index_id: {
          oneof: ['frn_index_id']
        },
        _compound_frequency: {
          oneof: ['compound_frequency']
        }
      },
      fields: {
        ficc_id: {
          type: 'string',
          id: 1
        },
        enable: {
          type: 'bool',
          id: 2
        },
        create_time: {
          type: 'string',
          id: 3
        },
        update_time: {
          type: 'string',
          id: 4
        },
        key_market: {
          type: 'string',
          id: 5
        },
        code_market: {
          type: 'string',
          id: 6
        },
        bond_code: {
          type: 'string',
          id: 7
        },
        bond_key: {
          type: 'string',
          id: 8
        },
        display_code: {
          type: 'string',
          id: 9
        },
        bond_type: {
          type: 'string',
          id: 10
        },
        external_type: {
          type: 'string',
          id: 11
        },
        product_class: {
          type: 'ProductClassEnum',
          id: 12
        },
        product_type: {
          type: 'string',
          id: 13
        },
        product_code: {
          type: 'string',
          id: 14
        },
        bond_ficc_type: {
          type: 'string',
          id: 15
        },
        listed_market: {
          type: 'string',
          id: 16
        },
        listed_date: {
          type: 'string',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        delisted_date: {
          type: 'string',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        full_name: {
          type: 'string',
          id: 19
        },
        pinyin_full: {
          type: 'string',
          id: 20
        },
        short_name: {
          type: 'string',
          id: 21
        },
        pinyin: {
          type: 'string',
          id: 22
        },
        selective_code: {
          type: 'string',
          id: 23
        },
        selective_name: {
          type: 'string',
          id: 24
        },
        ficc_type_code: {
          type: 'string',
          id: 25
        },
        ficc_belong: {
          type: 'string',
          id: 26
        },
        bond_category: {
          type: 'BondCategoryEnum',
          id: 27
        },
        bond_sector: {
          type: 'BondSectorEnum',
          id: 28
        },
        fr_type: {
          type: 'FRTypeEnum',
          id: 29
        },
        is_fixed_rate: {
          type: 'bool',
          id: 30
        },
        perp_type: {
          type: 'PerpTypeEnum',
          id: 31
        },
        has_option: {
          type: 'bool',
          id: 32,
          options: {
            proto3_optional: true
          }
        },
        option_type: {
          type: 'string',
          id: 33,
          options: {
            proto3_optional: true
          }
        },
        option_date: {
          type: 'string',
          id: 34,
          options: {
            proto3_optional: true
          }
        },
        term_structure: {
          type: 'string',
          id: 35,
          options: {
            proto3_optional: true
          }
        },
        conversion_rate: {
          type: 'double',
          id: 36,
          options: {
            proto3_optional: true
          }
        },
        fund_objective_sub_category: {
          type: 'string',
          id: 37,
          options: {
            proto3_optional: true
          }
        },
        fund_objective_category: {
          type: 'string',
          id: 38,
          options: {
            proto3_optional: true
          }
        },
        is_gn: {
          type: 'bool',
          id: 39,
          options: {
            proto3_optional: true
          }
        },
        ncd_subtype: {
          type: 'string',
          id: 40,
          options: {
            proto3_optional: true
          }
        },
        rating_augment: {
          type: 'string',
          id: 41,
          options: {
            proto3_optional: true
          }
        },
        warranter: {
          type: 'string',
          id: 42,
          options: {
            proto3_optional: true
          }
        },
        with_warranty: {
          type: 'bool',
          id: 43
        },
        warrant_method: {
          type: 'string',
          id: 44,
          options: {
            proto3_optional: true
          }
        },
        warrant_note: {
          type: 'string',
          id: 45,
          options: {
            proto3_optional: true
          }
        },
        asset_status: {
          type: 'string',
          id: 46,
          options: {
            proto3_optional: true
          }
        },
        is_cross_mkt: {
          type: 'bool',
          id: 47
        },
        is_mortgage: {
          type: 'bool',
          id: 48
        },
        mkt_type: {
          type: 'MktTypeEnum',
          id: 49
        },
        is_municipal: {
          type: 'bool',
          id: 50
        },
        ent_cor: {
          type: 'string',
          id: 51,
          options: {
            proto3_optional: true
          }
        },
        maturity_date: {
          type: 'string',
          id: 52,
          options: {
            proto3_optional: true
          }
        },
        maturity_is_holiday: {
          type: 'bool',
          id: 53,
          options: {
            proto3_optional: true
          }
        },
        time_to_maturity: {
          type: 'string',
          id: 54,
          options: {
            proto3_optional: true
          }
        },
        first_maturity_date: {
          type: 'string',
          id: 55,
          options: {
            proto3_optional: true
          }
        },
        rest_day_to_workday: {
          type: 'RestDayToWorkdayStruct',
          id: 56,
          options: {
            proto3_optional: true
          }
        },
        redemption_no: {
          type: 'int32',
          id: 57,
          options: {
            proto3_optional: true
          }
        },
        sceniority: {
          type: 'string',
          id: 58,
          options: {
            proto3_optional: true
          }
        },
        liquidity_supporter: {
          type: 'string',
          id: 59,
          options: {
            proto3_optional: true
          }
        },
        val_yield_exe: {
          type: 'double',
          id: 60,
          options: {
            proto3_optional: true
          }
        },
        val_yield_mat: {
          type: 'double',
          id: 61,
          options: {
            proto3_optional: true
          }
        },
        val_clean_price_exe: {
          type: 'double',
          id: 62,
          options: {
            proto3_optional: true
          }
        },
        val_clean_price_mat: {
          type: 'double',
          id: 63,
          options: {
            proto3_optional: true
          }
        },
        val_full_price_exe: {
          type: 'double',
          id: 64,
          options: {
            proto3_optional: true
          }
        },
        val_full_price_mat: {
          type: 'double',
          id: 65,
          options: {
            proto3_optional: true
          }
        },
        val_modified_duration: {
          type: 'double',
          id: 66,
          options: {
            proto3_optional: true
          }
        },
        val_convexity: {
          type: 'double',
          id: 67,
          options: {
            proto3_optional: true
          }
        },
        val_basis_point_value: {
          type: 'double',
          id: 68,
          options: {
            proto3_optional: true
          }
        },
        csi_yield_exe: {
          type: 'double',
          id: 69,
          options: {
            proto3_optional: true
          }
        },
        csi_yield_mat: {
          type: 'double',
          id: 70,
          options: {
            proto3_optional: true
          }
        },
        csi_clean_price_exe: {
          type: 'double',
          id: 71,
          options: {
            proto3_optional: true
          }
        },
        csi_clean_price_mat: {
          type: 'double',
          id: 72,
          options: {
            proto3_optional: true
          }
        },
        csi_full_price_exe: {
          type: 'double',
          id: 73,
          options: {
            proto3_optional: true
          }
        },
        csi_full_price_mat: {
          type: 'double',
          id: 74,
          options: {
            proto3_optional: true
          }
        },
        csi_recommendation: {
          type: 'bool',
          id: 75
        },
        rating: {
          type: 'string',
          id: 76,
          options: {
            proto3_optional: true
          }
        },
        rating_inst_code: {
          type: 'string',
          id: 77,
          options: {
            proto3_optional: true
          }
        },
        rating_date: {
          type: 'string',
          id: 78,
          options: {
            proto3_optional: true
          }
        },
        implied_rating: {
          type: 'string',
          id: 79,
          options: {
            proto3_optional: true
          }
        },
        cbc_rating: {
          type: 'string',
          id: 80,
          options: {
            proto3_optional: true
          }
        },
        issuer_rating: {
          type: 'string',
          id: 81,
          options: {
            proto3_optional: true
          }
        },
        issuer_rating_inst_code: {
          type: 'string',
          id: 82,
          options: {
            proto3_optional: true
          }
        },
        issuer_rating_date: {
          type: 'string',
          id: 83,
          options: {
            proto3_optional: true
          }
        },
        issuer_outlook_current: {
          type: 'string',
          id: 84,
          options: {
            proto3_optional: true
          }
        },
        issuer_code: {
          type: 'string',
          id: 85
        },
        issue_year: {
          type: 'int32',
          id: 86
        },
        issue_price: {
          type: 'double',
          id: 87,
          options: {
            proto3_optional: true
          }
        },
        issue_rate: {
          type: 'double',
          id: 88,
          options: {
            proto3_optional: true
          }
        },
        issue_amount: {
          type: 'double',
          id: 89,
          options: {
            proto3_optional: true
          }
        },
        issue_start_date: {
          type: 'string',
          id: 90,
          options: {
            proto3_optional: true
          }
        },
        issue_end_date: {
          type: 'string',
          id: 91,
          options: {
            proto3_optional: true
          }
        },
        underwriter_code: {
          type: 'string',
          id: 92,
          options: {
            proto3_optional: true
          }
        },
        underwriter_group: {
          type: 'string',
          id: 93,
          options: {
            proto3_optional: true
          }
        },
        maturity_term: {
          type: 'double',
          id: 94,
          options: {
            proto3_optional: true
          }
        },
        term_unit: {
          type: 'string',
          id: 95,
          options: {
            proto3_optional: true
          }
        },
        repayment_method: {
          type: 'RepaymentMethodEnum',
          id: 96
        },
        interest_start_date: {
          type: 'string',
          id: 97,
          options: {
            proto3_optional: true
          }
        },
        first_coupon_date: {
          type: 'string',
          id: 98,
          options: {
            proto3_optional: true
          }
        },
        next_coupon_date: {
          type: 'string',
          id: 99,
          options: {
            proto3_optional: true
          }
        },
        call_str: {
          type: 'string',
          id: 100,
          options: {
            proto3_optional: true
          }
        },
        put_str: {
          type: 'string',
          id: 101,
          options: {
            proto3_optional: true
          }
        },
        coupon_type: {
          type: 'string',
          id: 102,
          options: {
            proto3_optional: true
          }
        },
        coupon_rate_spread: {
          type: 'double',
          id: 103,
          options: {
            proto3_optional: true
          }
        },
        coupon_rate_current: {
          type: 'double',
          id: 104,
          options: {
            proto3_optional: true
          }
        },
        coupon_frequency: {
          type: 'string',
          id: 105,
          options: {
            proto3_optional: true
          }
        },
        frn_index_id: {
          type: 'string',
          id: 106,
          options: {
            proto3_optional: true
          }
        },
        compound_frequency: {
          type: 'string',
          id: 107,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    BondQuoteOperationLogStruct: {
      oneofs: {
        _code_market: {
          oneof: ['code_market']
        },
        _key_market: {
          oneof: ['key_market']
        }
      },
      fields: {
        log_id: {
          type: 'string',
          id: 1
        },
        quote_id: {
          type: 'string',
          id: 2
        },
        operator: {
          type: 'string',
          id: 3
        },
        operation_type: {
          type: 'string',
          id: 4
        },
        quote_snapshot: {
          type: 'BondQuoteStruct',
          id: 5
        },
        create_time: {
          type: 'string',
          id: 6
        },
        operation_type_val: {
          type: 'OperationTypeEnum',
          id: 7
        },
        operation_source: {
          type: 'OperationSourceEnum',
          id: 8
        },
        code_market: {
          type: 'string',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        key_market: {
          type: 'string',
          id: 10,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    DealNoticeStruct: {
      oneofs: {
        _contract_id: {
          oneof: ['contract_id']
        },
        _send_direction: {
          oneof: ['send_direction']
        },
        _receive_trader_id: {
          oneof: ['receive_trader_id']
        },
        _send_channel: {
          oneof: ['send_channel']
        },
        _cost: {
          oneof: ['cost']
        },
        _special_brokerage: {
          oneof: ['special_brokerage']
        },
        _remarks: {
          oneof: ['remarks']
        }
      },
      fields: {
        contract_id: {
          type: 'string',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        send_direction: {
          type: 'int32',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        receive_trader_id: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        send_channel: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        cost: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        special_brokerage: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        remarks: {
          type: 'string',
          id: 7,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    DealPayForInstStruct: {
      oneofs: {
        _contract_id: {
          oneof: ['contract_id']
        },
        _pay_for_direction: {
          oneof: ['pay_for_direction']
        },
        _inst: {
          oneof: ['inst']
        },
        _trader_id: {
          oneof: ['trader_id']
        },
        _trader_remarks: {
          oneof: ['trader_remarks']
        },
        _nc: {
          oneof: ['nc']
        }
      },
      fields: {
        contract_id: {
          type: 'string',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        pay_for_direction: {
          type: 'int32',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        inst: {
          type: 'InstitutionLiteStruct',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        trader_id: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        trader_remarks: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        nc: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    DealInstSimpleInfo: {
      oneofs: {
        _inst_id: {
          oneof: ['inst_id']
        },
        _trader_id: {
          oneof: ['trader_id']
        },
        _trader_remarks: {
          oneof: ['trader_remarks']
        },
        _nc: {
          oneof: ['nc']
        },
        _broker_id: {
          oneof: ['broker_id']
        },
        _brokerage: {
          oneof: ['brokerage']
        },
        _broker_id_b: {
          oneof: ['broker_id_b']
        },
        _broker_id_c: {
          oneof: ['broker_id_c']
        },
        _broker_id_d: {
          oneof: ['broker_id_d']
        },
        _broker_percent: {
          oneof: ['broker_percent']
        },
        _broker_percent_b: {
          oneof: ['broker_percent_b']
        },
        _broker_percent_c: {
          oneof: ['broker_percent_c']
        },
        _broker_percent_d: {
          oneof: ['broker_percent_d']
        },
        _quote_id: {
          oneof: ['quote_id']
        },
        _broker_confirmed: {
          oneof: ['broker_confirmed']
        },
        _broker_confirmed_time: {
          oneof: ['broker_confirmed_time']
        },
        _is_nc: {
          oneof: ['is_nc']
        },
        _bridge: {
          oneof: ['bridge']
        },
        _charge: {
          oneof: ['charge']
        },
        _is_pay_for: {
          oneof: ['is_pay_for']
        },
        _trade_mode: {
          oneof: ['trade_mode']
        },
        _pay_for_inst: {
          oneof: ['pay_for_inst']
        },
        _special_inst: {
          oneof: ['special_inst']
        },
        _msg_inst: {
          oneof: ['msg_inst']
        }
      },
      fields: {
        inst_id: {
          type: 'string',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        trader_id: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        trader_remarks: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        nc: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        broker_id: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        brokerage: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        broker_id_b: {
          type: 'string',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        broker_id_c: {
          type: 'string',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        broker_id_d: {
          type: 'string',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        broker_percent: {
          type: 'int32',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        broker_percent_b: {
          type: 'int32',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        broker_percent_c: {
          type: 'int32',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        broker_percent_d: {
          type: 'int32',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        quote_id: {
          type: 'string',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        broker_confirmed: {
          type: 'int32',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        broker_confirmed_time: {
          type: 'string',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        is_nc: {
          type: 'int32',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        bridge: {
          type: 'int32',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        charge: {
          type: 'int32',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        is_pay_for: {
          type: 'int32',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        trade_mode: {
          type: 'TradeModeEnum',
          id: 21,
          options: {
            proto3_optional: true
          }
        },
        pay_for_inst: {
          type: 'DealPayForInstStruct',
          id: 22,
          options: {
            proto3_optional: true
          }
        },
        special_inst: {
          type: 'string',
          id: 23,
          options: {
            proto3_optional: true
          }
        },
        msg_inst: {
          type: 'string',
          id: 24,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    DealInstDetailStruct: {
      oneofs: {
        _inst: {
          oneof: ['inst']
        },
        _trader: {
          oneof: ['trader']
        },
        _trader_remarks: {
          oneof: ['trader_remarks']
        },
        _nc: {
          oneof: ['nc']
        },
        _broker: {
          oneof: ['broker']
        },
        _brokerage: {
          oneof: ['brokerage']
        },
        _broker_b: {
          oneof: ['broker_b']
        },
        _broker_c: {
          oneof: ['broker_c']
        },
        _broker_d: {
          oneof: ['broker_d']
        },
        _broker_percent: {
          oneof: ['broker_percent']
        },
        _broker_percent_b: {
          oneof: ['broker_percent_b']
        },
        _broker_percent_c: {
          oneof: ['broker_percent_c']
        },
        _broker_percent_d: {
          oneof: ['broker_percent_d']
        },
        _quote_id: {
          oneof: ['quote_id']
        },
        _broker_confirmed: {
          oneof: ['broker_confirmed']
        },
        _broker_confirmed_time: {
          oneof: ['broker_confirmed_time']
        },
        _is_nc: {
          oneof: ['is_nc']
        },
        _bridge: {
          oneof: ['bridge']
        },
        _charge: {
          oneof: ['charge']
        },
        _is_pay_for: {
          oneof: ['is_pay_for']
        },
        _bid_trade_mode: {
          oneof: ['bid_trade_mode']
        },
        _pay_for_inst: {
          oneof: ['pay_for_inst']
        },
        _special_inst: {
          oneof: ['special_inst']
        },
        _msg_inst: {
          oneof: ['msg_inst']
        }
      },
      fields: {
        inst: {
          type: 'InstitutionLiteStruct',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        trader: {
          type: 'TraderStruct',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        trader_remarks: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        nc: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        broker: {
          type: 'UserStruct',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        brokerage: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        broker_b: {
          type: 'UserStruct',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        broker_c: {
          type: 'UserStruct',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        broker_d: {
          type: 'UserStruct',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        broker_percent: {
          type: 'int32',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        broker_percent_b: {
          type: 'int32',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        broker_percent_c: {
          type: 'int32',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        broker_percent_d: {
          type: 'int32',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        quote_id: {
          type: 'string',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        broker_confirmed: {
          type: 'int32',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        broker_confirmed_time: {
          type: 'string',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        is_nc: {
          type: 'int32',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        bridge: {
          type: 'int32',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        charge: {
          type: 'int32',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        is_pay_for: {
          type: 'int32',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        bid_trade_mode: {
          type: 'TradeModeEnum',
          id: 21,
          options: {
            proto3_optional: true
          }
        },
        pay_for_inst: {
          type: 'DealPayForInstStruct',
          id: 22,
          options: {
            proto3_optional: true
          }
        },
        special_inst: {
          type: 'string',
          id: 23,
          options: {
            proto3_optional: true
          }
        },
        msg_inst: {
          type: 'string',
          id: 24,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    TradeInfoStruct: {
      oneofs: {
        _inst_id: {
          oneof: ['inst_id']
        },
        _full_name: {
          oneof: ['full_name']
        },
        _short_name_zh: {
          oneof: ['short_name_zh']
        },
        _full_name_zh: {
          oneof: ['full_name_zh']
        },
        _trader_id: {
          oneof: ['trader_id']
        },
        _name_zh: {
          oneof: ['name_zh']
        },
        _trader_tag: {
          oneof: ['trader_tag']
        },
        _flag_modify_brokerage: {
          oneof: ['flag_modify_brokerage']
        },
        _modify_brokerage_reason: {
          oneof: ['modify_brokerage_reason']
        },
        _confirm_status: {
          oneof: ['confirm_status']
        },
        _broker_id: {
          oneof: ['broker_id']
        },
        _broker_name_zh: {
          oneof: ['broker_name_zh']
        },
        _brokerage_comment: {
          oneof: ['brokerage_comment']
        }
      },
      fields: {
        inst_id: {
          type: 'string',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        full_name: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        short_name_zh: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        full_name_zh: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        trader_id: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        name_zh: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        trader_tag: {
          type: 'string',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        flag_modify_brokerage: {
          type: 'bool',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        modify_brokerage_reason: {
          type: 'string',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        confirm_status: {
          type: 'SpotPricingConfirmStatusEnum',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        broker_id: {
          type: 'string',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        broker_name_zh: {
          type: 'string',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        brokerage_comment: {
          type: 'ReceiptDealTradeInstBrokerageCommentEnum',
          id: 13,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    SpotPricingStruct: {
      oneofs: {
        _contract_id: {
          oneof: ['contract_id']
        },
        _internal_code: {
          oneof: ['internal_code']
        },
        _create_time: {
          oneof: ['create_time']
        },
        _update_time: {
          oneof: ['update_time']
        },
        _deal_type: {
          oneof: ['deal_type']
        },
        _source: {
          oneof: ['source']
        },
        _flag_bridge: {
          oneof: ['flag_bridge']
        },
        _send_order_msg: {
          oneof: ['send_order_msg']
        },
        _bid_send_order_msg: {
          oneof: ['bid_send_order_msg']
        },
        _ofr_send_order_msg: {
          oneof: ['ofr_send_order_msg']
        },
        _bond_info: {
          oneof: ['bond_info']
        },
        _confirm_volume: {
          oneof: ['confirm_volume']
        },
        _price_type: {
          oneof: ['price_type']
        },
        _price: {
          oneof: ['price']
        },
        _yield: {
          oneof: ['yield']
        },
        _clean_price: {
          oneof: ['clean_price']
        },
        _full_price: {
          oneof: ['full_price']
        },
        _return_point: {
          oneof: ['return_point']
        },
        _bid_traded_date: {
          oneof: ['bid_traded_date']
        },
        _bid_delivery_date: {
          oneof: ['bid_delivery_date']
        },
        _ofr_traded_date: {
          oneof: ['ofr_traded_date']
        },
        _ofr_delivery_date: {
          oneof: ['ofr_delivery_date']
        },
        _flag_exchange: {
          oneof: ['flag_exchange']
        },
        _exercise_type: {
          oneof: ['exercise_type']
        },
        _spot_pricing_status: {
          oneof: ['spot_pricing_status']
        },
        _spot_pricing_inst: {
          oneof: ['spot_pricing_inst']
        },
        _be_spot_pricing_inst: {
          oneof: ['be_spot_pricing_inst']
        },
        _spot_pricing_record_id: {
          oneof: ['spot_pricing_record_id']
        },
        _flag_internal: {
          oneof: ['flag_internal']
        },
        _operator: {
          oneof: ['operator']
        },
        _listed_market: {
          oneof: ['listed_market']
        },
        _bid_bridge_operator: {
          oneof: ['bid_bridge_operator']
        },
        _ofr_bridge_operator: {
          oneof: ['ofr_bridge_operator']
        },
        _im_msg_text: {
          oneof: ['im_msg_text']
        },
        _im_msg_send_status: {
          oneof: ['im_msg_send_status']
        },
        _im_msg_record_id: {
          oneof: ['im_msg_record_id']
        },
        _quote_id: {
          oneof: ['quote_id']
        },
        _spot_pricing_volume: {
          oneof: ['spot_pricing_volume']
        },
        _bid_old_content: {
          oneof: ['bid_old_content']
        },
        _ofr_old_content: {
          oneof: ['ofr_old_content']
        },
        _exercise_manual: {
          oneof: ['exercise_manual']
        },
        _bond_basic_info: {
          oneof: ['bond_basic_info']
        }
      },
      fields: {
        contract_id: {
          type: 'string',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        internal_code: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        create_time: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        update_time: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        deal_type: {
          type: 'DealTypeEnum',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        source: {
          type: 'OperationSourceEnum',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        flag_bridge: {
          type: 'bool',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        send_order_msg: {
          type: 'string',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        bid_send_order_msg: {
          type: 'string',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        ofr_send_order_msg: {
          type: 'string',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        bond_info: {
          type: 'BondLiteStruct',
          id: 11,
          options: {
            deprecated: true,
            proto3_optional: true
          }
        },
        confirm_volume: {
          type: 'double',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        price_type: {
          type: 'BondQuoteTypeEnum',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        price: {
          type: 'double',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        yield: {
          type: 'double',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        clean_price: {
          type: 'double',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        full_price: {
          type: 'double',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        return_point: {
          type: 'double',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        bid_settlement_type: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 19
        },
        bid_traded_date: {
          type: 'string',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        bid_delivery_date: {
          type: 'string',
          id: 21,
          options: {
            proto3_optional: true
          }
        },
        ofr_settlement_type: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 22
        },
        ofr_traded_date: {
          type: 'string',
          id: 23,
          options: {
            proto3_optional: true
          }
        },
        ofr_delivery_date: {
          type: 'string',
          id: 24,
          options: {
            proto3_optional: true
          }
        },
        flag_exchange: {
          type: 'bool',
          id: 25,
          options: {
            proto3_optional: true
          }
        },
        exercise_type: {
          type: 'ExerciseTypeEnum',
          id: 26,
          options: {
            proto3_optional: true
          }
        },
        spot_pricing_status: {
          type: 'SpotPricingConfirmStatusEnum',
          id: 27,
          options: {
            proto3_optional: true
          }
        },
        spot_pricing_inst: {
          type: 'TradeInfoStruct',
          id: 28,
          options: {
            proto3_optional: true
          }
        },
        be_spot_pricing_inst: {
          type: 'TradeInfoStruct',
          id: 29,
          options: {
            proto3_optional: true
          }
        },
        spot_pricing_record_id: {
          type: 'string',
          id: 30,
          options: {
            proto3_optional: true
          }
        },
        flag_internal: {
          type: 'bool',
          id: 31,
          options: {
            proto3_optional: true
          }
        },
        operator: {
          type: 'UserLiteStruct',
          id: 32,
          options: {
            proto3_optional: true
          }
        },
        listed_market: {
          type: 'ListedMarketEnum',
          id: 33,
          options: {
            proto3_optional: true
          }
        },
        bid_bridge_operator: {
          type: 'UserLiteStruct',
          id: 34,
          options: {
            proto3_optional: true
          }
        },
        ofr_bridge_operator: {
          type: 'UserLiteStruct',
          id: 35,
          options: {
            proto3_optional: true
          }
        },
        im_msg_text: {
          type: 'string',
          id: 36,
          options: {
            proto3_optional: true
          }
        },
        im_msg_send_status: {
          type: 'ImMsgSendStatusEnum',
          id: 37,
          options: {
            proto3_optional: true
          }
        },
        im_msg_record_id: {
          type: 'string',
          id: 38,
          options: {
            proto3_optional: true
          }
        },
        quote_id: {
          type: 'string',
          id: 39,
          options: {
            proto3_optional: true
          }
        },
        spot_pricing_volume: {
          type: 'double',
          id: 40,
          options: {
            proto3_optional: true
          }
        },
        bid_old_content: {
          type: 'OldContentStruct',
          id: 41,
          options: {
            proto3_optional: true
          }
        },
        ofr_old_content: {
          type: 'OldContentStruct',
          id: 42,
          options: {
            proto3_optional: true
          }
        },
        bid_deal_read_status: {
          type: 'DealReadStatusEnum',
          id: 43
        },
        ofr_deal_read_status: {
          type: 'DealReadStatusEnum',
          id: 44
        },
        exercise_manual: {
          type: 'bool',
          id: 45,
          options: {
            proto3_optional: true
          }
        },
        bond_basic_info: {
          type: 'FiccBondBasicStruct',
          id: 46,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    OldContentStruct: {
      oneofs: {
        _bid_send_order_msg: {
          oneof: ['bid_send_order_msg']
        },
        _ofr_send_order_msg: {
          oneof: ['ofr_send_order_msg']
        },
        _yield: {
          oneof: ['yield']
        },
        _clean_price: {
          oneof: ['clean_price']
        },
        _full_price: {
          oneof: ['full_price']
        },
        _return_point: {
          oneof: ['return_point']
        },
        _bid_trader_info: {
          oneof: ['bid_trader_info']
        },
        _ofr_trader_info: {
          oneof: ['ofr_trader_info']
        },
        _ofr_broker_info: {
          oneof: ['ofr_broker_info']
        },
        _bid_trader_tag: {
          oneof: ['bid_trader_tag']
        },
        _ofr_trader_tag: {
          oneof: ['ofr_trader_tag']
        },
        _bid_bridge_send_order_comment: {
          oneof: ['bid_bridge_send_order_comment']
        },
        _ofr_bridge_send_order_comment: {
          oneof: ['ofr_bridge_send_order_comment']
        },
        _bid_broker_info_b: {
          oneof: ['bid_broker_info_b']
        },
        _bid_broker_info_c: {
          oneof: ['bid_broker_info_c']
        },
        _bid_broker_info_d: {
          oneof: ['bid_broker_info_d']
        },
        _ofr_broker_info_b: {
          oneof: ['ofr_broker_info_b']
        },
        _ofr_broker_info_c: {
          oneof: ['ofr_broker_info_c']
        },
        _ofr_broker_info_d: {
          oneof: ['ofr_broker_info_d']
        },
        _bond_display_code: {
          oneof: ['bond_display_code']
        },
        _bond_short_name: {
          oneof: ['bond_short_name']
        },
        _bid_inst_info: {
          oneof: ['bid_inst_info']
        },
        _ofr_inst_info: {
          oneof: ['ofr_inst_info']
        },
        _bid_trader_lite_info: {
          oneof: ['bid_trader_lite_info']
        },
        _ofr_trader_lite_info: {
          oneof: ['ofr_trader_lite_info']
        }
      },
      fields: {
        flag_bridge: {
          type: 'bool',
          id: 1
        },
        bid_send_order_msg: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        ofr_send_order_msg: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        bond_key_market: {
          type: 'string',
          id: 4
        },
        price: {
          type: 'double',
          id: 5
        },
        yield: {
          type: 'double',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        clean_price: {
          type: 'double',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        full_price: {
          type: 'double',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        return_point: {
          type: 'double',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        confirm_volume: {
          type: 'double',
          id: 10
        },
        flag_exchange: {
          type: 'bool',
          id: 11
        },
        bid_trader_info: {
          type: 'TraderStruct',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        bid_broker_info: {
          type: 'UserStruct',
          id: 13
        },
        ofr_trader_info: {
          type: 'TraderStruct',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        ofr_broker_info: {
          type: 'UserStruct',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        deal_type: {
          type: 'DealTypeEnum',
          id: 16
        },
        bid_traded_date: {
          type: 'string',
          id: 17
        },
        bid_delivery_date: {
          type: 'string',
          id: 18
        },
        ofr_traded_date: {
          type: 'string',
          id: 19
        },
        ofr_delivery_date: {
          type: 'string',
          id: 20
        },
        price_type: {
          type: 'BondQuoteTypeEnum',
          id: 21
        },
        exercise_type: {
          type: 'ExerciseTypeEnum',
          id: 22
        },
        bid_trader_tag: {
          type: 'string',
          id: 23,
          options: {
            proto3_optional: true
          }
        },
        ofr_trader_tag: {
          type: 'string',
          id: 24,
          options: {
            proto3_optional: true
          }
        },
        bid_bridge_send_order_comment: {
          type: 'string',
          id: 25,
          options: {
            proto3_optional: true
          }
        },
        ofr_bridge_send_order_comment: {
          type: 'string',
          id: 26,
          options: {
            proto3_optional: true
          }
        },
        exercise_manual: {
          type: 'bool',
          id: 27
        },
        bid_broker_info_b: {
          type: 'UserStruct',
          id: 28,
          options: {
            proto3_optional: true
          }
        },
        bid_broker_info_c: {
          type: 'UserStruct',
          id: 29,
          options: {
            proto3_optional: true
          }
        },
        bid_broker_info_d: {
          type: 'UserStruct',
          id: 30,
          options: {
            proto3_optional: true
          }
        },
        ofr_broker_info_b: {
          type: 'UserStruct',
          id: 31,
          options: {
            proto3_optional: true
          }
        },
        ofr_broker_info_c: {
          type: 'UserStruct',
          id: 32,
          options: {
            proto3_optional: true
          }
        },
        ofr_broker_info_d: {
          type: 'UserStruct',
          id: 33,
          options: {
            proto3_optional: true
          }
        },
        bond_display_code: {
          type: 'string',
          id: 34,
          options: {
            proto3_optional: true
          }
        },
        bond_short_name: {
          type: 'string',
          id: 35,
          options: {
            proto3_optional: true
          }
        },
        bid_inst_info: {
          type: 'InstitutionTinyStruct',
          id: 36,
          options: {
            proto3_optional: true
          }
        },
        ofr_inst_info: {
          type: 'InstitutionTinyStruct',
          id: 37,
          options: {
            proto3_optional: true
          }
        },
        bid_trader_lite_info: {
          type: 'TraderLiteStruct',
          id: 38,
          options: {
            proto3_optional: true
          }
        },
        ofr_trader_lite_info: {
          type: 'TraderLiteStruct',
          id: 39,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    OldContentSyncStruct: {
      oneofs: {
        _flag_bridge: {
          oneof: ['flag_bridge']
        },
        _bid_send_order_msg: {
          oneof: ['bid_send_order_msg']
        },
        _ofr_send_order_msg: {
          oneof: ['ofr_send_order_msg']
        },
        _bond_key_market: {
          oneof: ['bond_key_market']
        },
        _price: {
          oneof: ['price']
        },
        _yield: {
          oneof: ['yield']
        },
        _clean_price: {
          oneof: ['clean_price']
        },
        _full_price: {
          oneof: ['full_price']
        },
        _return_point: {
          oneof: ['return_point']
        },
        _confirm_volume: {
          oneof: ['confirm_volume']
        },
        _flag_exchange: {
          oneof: ['flag_exchange']
        },
        _bid_trader_id: {
          oneof: ['bid_trader_id']
        },
        _bid_broker_id: {
          oneof: ['bid_broker_id']
        },
        _ofr_trader_id: {
          oneof: ['ofr_trader_id']
        },
        _ofr_broker_id: {
          oneof: ['ofr_broker_id']
        },
        _deal_type: {
          oneof: ['deal_type']
        },
        _bid_traded_date: {
          oneof: ['bid_traded_date']
        },
        _bid_delivery_date: {
          oneof: ['bid_delivery_date']
        },
        _ofr_traded_date: {
          oneof: ['ofr_traded_date']
        },
        _ofr_delivery_date: {
          oneof: ['ofr_delivery_date']
        },
        _price_type: {
          oneof: ['price_type']
        },
        _exercise_type: {
          oneof: ['exercise_type']
        },
        _bid_trader_tag: {
          oneof: ['bid_trader_tag']
        },
        _ofr_trader_tag: {
          oneof: ['ofr_trader_tag']
        },
        _bid_bridge_send_order_comment: {
          oneof: ['bid_bridge_send_order_comment']
        },
        _ofr_bridge_send_order_comment: {
          oneof: ['ofr_bridge_send_order_comment']
        },
        _bid_broker_id_b: {
          oneof: ['bid_broker_id_b']
        },
        _bid_broker_id_c: {
          oneof: ['bid_broker_id_c']
        },
        _bid_broker_id_d: {
          oneof: ['bid_broker_id_d']
        },
        _ofr_broker_id_b: {
          oneof: ['ofr_broker_id_b']
        },
        _ofr_broker_id_c: {
          oneof: ['ofr_broker_id_c']
        },
        _ofr_broker_id_d: {
          oneof: ['ofr_broker_id_d']
        }
      },
      fields: {
        flag_bridge: {
          type: 'bool',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        bid_send_order_msg: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        ofr_send_order_msg: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        bond_key_market: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        price: {
          type: 'double',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        yield: {
          type: 'double',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        clean_price: {
          type: 'double',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        full_price: {
          type: 'double',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        return_point: {
          type: 'double',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        confirm_volume: {
          type: 'double',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        flag_exchange: {
          type: 'bool',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        bid_trader_id: {
          type: 'string',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        bid_broker_id: {
          type: 'string',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        ofr_trader_id: {
          type: 'string',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        ofr_broker_id: {
          type: 'string',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        deal_type: {
          type: 'DealTypeEnum',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        bid_traded_date: {
          type: 'string',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        bid_delivery_date: {
          type: 'string',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        ofr_traded_date: {
          type: 'string',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        ofr_delivery_date: {
          type: 'string',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        price_type: {
          type: 'BondQuoteTypeEnum',
          id: 21,
          options: {
            proto3_optional: true
          }
        },
        exercise_type: {
          type: 'ExerciseTypeEnum',
          id: 22,
          options: {
            proto3_optional: true
          }
        },
        bid_trader_tag: {
          type: 'string',
          id: 23,
          options: {
            proto3_optional: true
          }
        },
        ofr_trader_tag: {
          type: 'string',
          id: 24,
          options: {
            proto3_optional: true
          }
        },
        bid_bridge_send_order_comment: {
          type: 'string',
          id: 25,
          options: {
            proto3_optional: true
          }
        },
        ofr_bridge_send_order_comment: {
          type: 'string',
          id: 26,
          options: {
            proto3_optional: true
          }
        },
        exercise_manual: {
          type: 'bool',
          id: 27
        },
        bid_broker_id_b: {
          type: 'string',
          id: 28,
          options: {
            proto3_optional: true
          }
        },
        bid_broker_id_c: {
          type: 'string',
          id: 29,
          options: {
            proto3_optional: true
          }
        },
        bid_broker_id_d: {
          type: 'string',
          id: 30,
          options: {
            proto3_optional: true
          }
        },
        ofr_broker_id_b: {
          type: 'string',
          id: 31,
          options: {
            proto3_optional: true
          }
        },
        ofr_broker_id_c: {
          type: 'string',
          id: 32,
          options: {
            proto3_optional: true
          }
        },
        ofr_broker_id_d: {
          type: 'string',
          id: 33,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    MarketDealStruct: {
      oneofs: {
        _price: {
          oneof: ['price']
        },
        _yield: {
          oneof: ['yield']
        },
        _clean_price: {
          oneof: ['clean_price']
        },
        _full_price: {
          oneof: ['full_price']
        },
        _spread: {
          oneof: ['spread']
        },
        _return_point: {
          oneof: ['return_point']
        },
        _volume: {
          oneof: ['volume']
        },
        _bid_institution_id: {
          oneof: ['bid_institution_id']
        },
        _bid_institution_name: {
          oneof: ['bid_institution_name']
        },
        _bid_trader_id: {
          oneof: ['bid_trader_id']
        },
        _bid_trader_name: {
          oneof: ['bid_trader_name']
        },
        _bid_trader_tag: {
          oneof: ['bid_trader_tag']
        },
        _bid_trader_is_vip: {
          oneof: ['bid_trader_is_vip']
        },
        _bid_broker_id: {
          oneof: ['bid_broker_id']
        },
        _bid_broker_name: {
          oneof: ['bid_broker_name']
        },
        _bid_broker_percent: {
          oneof: ['bid_broker_percent']
        },
        _ofr_institution_id: {
          oneof: ['ofr_institution_id']
        },
        _ofr_institution_name: {
          oneof: ['ofr_institution_name']
        },
        _ofr_trader_id: {
          oneof: ['ofr_trader_id']
        },
        _ofr_trader_name: {
          oneof: ['ofr_trader_name']
        },
        _ofr_trader_tag: {
          oneof: ['ofr_trader_tag']
        },
        _ofr_trader_is_vip: {
          oneof: ['ofr_trader_is_vip']
        },
        _ofr_broker_id: {
          oneof: ['ofr_broker_id']
        },
        _ofr_broker_name: {
          oneof: ['ofr_broker_name']
        },
        _ofr_broker_percent: {
          oneof: ['ofr_broker_percent']
        },
        _update_time: {
          oneof: ['update_time']
        },
        _exercise_manual: {
          oneof: ['exercise_manual']
        },
        _is_sync_receipt_deal: {
          oneof: ['is_sync_receipt_deal']
        }
      },
      fields: {
        deal_id: {
          type: 'string',
          id: 1
        },
        key_market: {
          type: 'string',
          id: 2
        },
        deal_time: {
          type: 'string',
          id: 3
        },
        traded_date: {
          type: 'string',
          id: 4
        },
        delivery_date: {
          type: 'string',
          id: 5
        },
        direction: {
          type: 'DirectionEnum',
          id: 6
        },
        price: {
          type: 'double',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        price_type: {
          type: 'BondQuoteTypeEnum',
          id: 8
        },
        yield: {
          type: 'double',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        clean_price: {
          type: 'double',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        full_price: {
          type: 'double',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        spread: {
          type: 'double',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        return_point: {
          type: 'double',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        volume: {
          type: 'double',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        is_exercise: {
          type: 'bool',
          id: 15
        },
        flag_rebate: {
          type: 'bool',
          id: 16
        },
        flag_internal: {
          type: 'bool',
          id: 17
        },
        operator_id: {
          type: 'string',
          id: 18
        },
        operator_name: {
          type: 'string',
          id: 19
        },
        comment: {
          type: 'string',
          id: 20
        },
        comment_flag_bridge: {
          type: 'bool',
          id: 21
        },
        comment_flag_pay_for: {
          type: 'bool',
          id: 22
        },
        source: {
          type: 'OperationSourceEnum',
          id: 23
        },
        product_type: {
          type: 'ProductTypeEnum',
          id: 24
        },
        liquidation_speed_list: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 25
        },
        bid_institution_id: {
          type: 'string',
          id: 26,
          options: {
            proto3_optional: true
          }
        },
        bid_institution_name: {
          type: 'string',
          id: 27,
          options: {
            proto3_optional: true
          }
        },
        bid_trader_id: {
          type: 'string',
          id: 28,
          options: {
            proto3_optional: true
          }
        },
        bid_trader_name: {
          type: 'string',
          id: 29,
          options: {
            proto3_optional: true
          }
        },
        bid_trader_tag: {
          type: 'string',
          id: 30,
          options: {
            proto3_optional: true
          }
        },
        bid_trader_is_vip: {
          type: 'bool',
          id: 31,
          options: {
            proto3_optional: true
          }
        },
        bid_broker_id: {
          type: 'string',
          id: 32,
          options: {
            proto3_optional: true
          }
        },
        bid_broker_name: {
          type: 'string',
          id: 33,
          options: {
            proto3_optional: true
          }
        },
        bid_broker_percent: {
          type: 'int32',
          id: 34,
          options: {
            proto3_optional: true
          }
        },
        ofr_institution_id: {
          type: 'string',
          id: 35,
          options: {
            proto3_optional: true
          }
        },
        ofr_institution_name: {
          type: 'string',
          id: 36,
          options: {
            proto3_optional: true
          }
        },
        ofr_trader_id: {
          type: 'string',
          id: 37,
          options: {
            proto3_optional: true
          }
        },
        ofr_trader_name: {
          type: 'string',
          id: 38,
          options: {
            proto3_optional: true
          }
        },
        ofr_trader_tag: {
          type: 'string',
          id: 39,
          options: {
            proto3_optional: true
          }
        },
        ofr_trader_is_vip: {
          type: 'bool',
          id: 40,
          options: {
            proto3_optional: true
          }
        },
        ofr_broker_id: {
          type: 'string',
          id: 41,
          options: {
            proto3_optional: true
          }
        },
        ofr_broker_name: {
          type: 'string',
          id: 42,
          options: {
            proto3_optional: true
          }
        },
        ofr_broker_percent: {
          type: 'int32',
          id: 43,
          options: {
            proto3_optional: true
          }
        },
        bond_info: {
          type: 'BondLiteStruct',
          id: 44,
          options: {
            deprecated: true
          }
        },
        with_active_quote: {
          type: 'bool',
          id: 45
        },
        nothing_done: {
          type: 'bool',
          id: 46
        },
        flag_intention: {
          type: 'bool',
          id: 47
        },
        last_action_type: {
          type: 'MarketDealLastActionTypeEnum',
          id: 48
        },
        join_count: {
          type: 'int32',
          id: 49
        },
        update_time: {
          type: 'string',
          id: 50,
          options: {
            proto3_optional: true
          }
        },
        bond_basic_info: {
          type: 'FiccBondBasicStruct',
          id: 51
        },
        exercise_manual: {
          type: 'bool',
          id: 52,
          options: {
            proto3_optional: true
          }
        },
        is_sync_receipt_deal: {
          type: 'bool',
          id: 53,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    MarketDealOperationLogStruct: {
      oneofs: {
        _code_market: {
          oneof: ['code_market']
        },
        _key_market: {
          oneof: ['key_market']
        }
      },
      fields: {
        log_id: {
          type: 'string',
          id: 1
        },
        deal_id: {
          type: 'string',
          id: 2
        },
        operator: {
          type: 'string',
          id: 3
        },
        operation_type: {
          type: 'string',
          id: 4
        },
        market_deal_snapshot: {
          type: 'MarketDealStruct',
          id: 5
        },
        create_time: {
          type: 'string',
          id: 6
        },
        operation_type_val: {
          type: 'OperationTypeEnum',
          id: 7
        },
        operation_source: {
          type: 'OperationSourceEnum',
          id: 8
        },
        code_market: {
          type: 'string',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        key_market: {
          type: 'string',
          id: 10,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    UpsertDealErrorRecord: {
      oneofs: {
        _error_type: {
          oneof: ['error_type']
        }
      },
      fields: {
        line_no: {
          type: 'int32',
          id: 1
        },
        error_msg: {
          type: 'string',
          id: 2
        },
        error_type: {
          type: 'int32',
          id: 3,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    MarketDealCreateStruct: {
      oneofs: {
        _quote_id: {
          oneof: ['quote_id']
        },
        _deal_time: {
          oneof: ['deal_time']
        },
        _traded_date: {
          oneof: ['traded_date']
        },
        _delivery_date: {
          oneof: ['delivery_date']
        },
        _price: {
          oneof: ['price']
        },
        _yield: {
          oneof: ['yield']
        },
        _clean_price: {
          oneof: ['clean_price']
        },
        _full_price: {
          oneof: ['full_price']
        },
        _spread: {
          oneof: ['spread']
        },
        _return_point: {
          oneof: ['return_point']
        },
        _volume: {
          oneof: ['volume']
        },
        _is_exercise: {
          oneof: ['is_exercise']
        },
        _flag_rebate: {
          oneof: ['flag_rebate']
        },
        _comment: {
          oneof: ['comment']
        },
        _bid_institution_id: {
          oneof: ['bid_institution_id']
        },
        _bid_trader_id: {
          oneof: ['bid_trader_id']
        },
        _bid_broker_id: {
          oneof: ['bid_broker_id']
        },
        _bid_broker_percent: {
          oneof: ['bid_broker_percent']
        },
        _ofr_institution_id: {
          oneof: ['ofr_institution_id']
        },
        _ofr_trader_id: {
          oneof: ['ofr_trader_id']
        },
        _ofr_broker_id: {
          oneof: ['ofr_broker_id']
        },
        _ofr_broker_percent: {
          oneof: ['ofr_broker_percent']
        },
        _bid_trader_tag: {
          oneof: ['bid_trader_tag']
        },
        _ofr_trader_tag: {
          oneof: ['ofr_trader_tag']
        },
        _flag_intention: {
          oneof: ['flag_intention']
        },
        _last_action_type: {
          oneof: ['last_action_type']
        },
        _join_count: {
          oneof: ['join_count']
        },
        _exercise_manual: {
          oneof: ['exercise_manual']
        },
        _settlement_amount: {
          oneof: ['settlement_amount']
        },
        _is_sync_receipt_deal: {
          oneof: ['is_sync_receipt_deal']
        }
      },
      fields: {
        key_market: {
          type: 'string',
          id: 1
        },
        quote_id: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        deal_time: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        traded_date: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        delivery_date: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        direction: {
          type: 'DirectionEnum',
          id: 6
        },
        price: {
          type: 'double',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        price_type: {
          type: 'BondQuoteTypeEnum',
          id: 8
        },
        yield: {
          type: 'double',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        clean_price: {
          type: 'double',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        full_price: {
          type: 'double',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        spread: {
          type: 'double',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        return_point: {
          type: 'double',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        volume: {
          type: 'double',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        is_exercise: {
          type: 'bool',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        flag_rebate: {
          type: 'bool',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        flag_internal: {
          type: 'bool',
          id: 17
        },
        comment: {
          type: 'string',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        comment_flag_bridge: {
          type: 'bool',
          id: 19
        },
        comment_flag_pay_for: {
          type: 'bool',
          id: 20
        },
        source: {
          type: 'OperationSourceEnum',
          id: 21
        },
        product_type: {
          type: 'ProductTypeEnum',
          id: 22
        },
        liquidation_speed_list: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 23
        },
        bid_institution_id: {
          type: 'string',
          id: 24,
          options: {
            proto3_optional: true
          }
        },
        bid_trader_id: {
          type: 'string',
          id: 25,
          options: {
            proto3_optional: true
          }
        },
        bid_broker_id: {
          type: 'string',
          id: 26,
          options: {
            proto3_optional: true
          }
        },
        bid_broker_percent: {
          type: 'int32',
          id: 27,
          options: {
            proto3_optional: true
          }
        },
        ofr_institution_id: {
          type: 'string',
          id: 28,
          options: {
            proto3_optional: true
          }
        },
        ofr_trader_id: {
          type: 'string',
          id: 29,
          options: {
            proto3_optional: true
          }
        },
        ofr_broker_id: {
          type: 'string',
          id: 30,
          options: {
            proto3_optional: true
          }
        },
        ofr_broker_percent: {
          type: 'int32',
          id: 31,
          options: {
            proto3_optional: true
          }
        },
        bid_trader_tag: {
          type: 'string',
          id: 32,
          options: {
            proto3_optional: true
          }
        },
        ofr_trader_tag: {
          type: 'string',
          id: 33,
          options: {
            proto3_optional: true
          }
        },
        flag_intention: {
          type: 'bool',
          id: 34,
          options: {
            proto3_optional: true
          }
        },
        last_action_type: {
          type: 'MarketDealLastActionTypeEnum',
          id: 35,
          options: {
            proto3_optional: true
          }
        },
        join_count: {
          type: 'int32',
          id: 36,
          options: {
            proto3_optional: true
          }
        },
        exercise_manual: {
          type: 'bool',
          id: 37,
          options: {
            proto3_optional: true
          }
        },
        settlement_amount: {
          type: 'double',
          id: 38,
          options: {
            proto3_optional: true
          }
        },
        is_sync_receipt_deal: {
          type: 'bool',
          id: 39,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    MarketDealUpdateStruct: {
      oneofs: {
        _deal_time: {
          oneof: ['deal_time']
        },
        _traded_date: {
          oneof: ['traded_date']
        },
        _delivery_date: {
          oneof: ['delivery_date']
        },
        _direction: {
          oneof: ['direction']
        },
        _price: {
          oneof: ['price']
        },
        _price_type: {
          oneof: ['price_type']
        },
        _yield: {
          oneof: ['yield']
        },
        _clean_price: {
          oneof: ['clean_price']
        },
        _full_price: {
          oneof: ['full_price']
        },
        _spread: {
          oneof: ['spread']
        },
        _return_point: {
          oneof: ['return_point']
        },
        _volume: {
          oneof: ['volume']
        },
        _is_exercise: {
          oneof: ['is_exercise']
        },
        _flag_rebate: {
          oneof: ['flag_rebate']
        },
        _flag_internal: {
          oneof: ['flag_internal']
        },
        _comment: {
          oneof: ['comment']
        },
        _comment_flag_bridge: {
          oneof: ['comment_flag_bridge']
        },
        _comment_flag_pay_for: {
          oneof: ['comment_flag_pay_for']
        },
        _source: {
          oneof: ['source']
        },
        _bid_institution_id: {
          oneof: ['bid_institution_id']
        },
        _bid_trader_id: {
          oneof: ['bid_trader_id']
        },
        _bid_broker_id: {
          oneof: ['bid_broker_id']
        },
        _bid_broker_percent: {
          oneof: ['bid_broker_percent']
        },
        _ofr_institution_id: {
          oneof: ['ofr_institution_id']
        },
        _ofr_trader_id: {
          oneof: ['ofr_trader_id']
        },
        _ofr_broker_id: {
          oneof: ['ofr_broker_id']
        },
        _ofr_broker_percent: {
          oneof: ['ofr_broker_percent']
        },
        _nothing_done: {
          oneof: ['nothing_done']
        },
        _operation_type: {
          oneof: ['operation_type']
        },
        _enable: {
          oneof: ['enable']
        },
        _bid_trader_tag: {
          oneof: ['bid_trader_tag']
        },
        _ofr_trader_tag: {
          oneof: ['ofr_trader_tag']
        },
        _flag_intention: {
          oneof: ['flag_intention']
        },
        _last_action_type: {
          oneof: ['last_action_type']
        },
        _join_count: {
          oneof: ['join_count']
        },
        _exercise_manual: {
          oneof: ['exercise_manual']
        },
        _settlement_amount: {
          oneof: ['settlement_amount']
        }
      },
      fields: {
        deal_id: {
          type: 'string',
          id: 1
        },
        deal_time: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        traded_date: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        delivery_date: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        direction: {
          type: 'DirectionEnum',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        price: {
          type: 'double',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        price_type: {
          type: 'BondQuoteTypeEnum',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        yield: {
          type: 'double',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        clean_price: {
          type: 'double',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        full_price: {
          type: 'double',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        spread: {
          type: 'double',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        return_point: {
          type: 'double',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        volume: {
          type: 'double',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        is_exercise: {
          type: 'bool',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        flag_rebate: {
          type: 'bool',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        flag_internal: {
          type: 'bool',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        comment: {
          type: 'string',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        comment_flag_bridge: {
          type: 'bool',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        comment_flag_pay_for: {
          type: 'bool',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        source: {
          type: 'OperationSourceEnum',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        liquidation_speed_list: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 21
        },
        bid_institution_id: {
          type: 'string',
          id: 22,
          options: {
            proto3_optional: true
          }
        },
        bid_trader_id: {
          type: 'string',
          id: 23,
          options: {
            proto3_optional: true
          }
        },
        bid_broker_id: {
          type: 'string',
          id: 24,
          options: {
            proto3_optional: true
          }
        },
        bid_broker_percent: {
          type: 'int32',
          id: 25,
          options: {
            proto3_optional: true
          }
        },
        ofr_institution_id: {
          type: 'string',
          id: 26,
          options: {
            proto3_optional: true
          }
        },
        ofr_trader_id: {
          type: 'string',
          id: 27,
          options: {
            proto3_optional: true
          }
        },
        ofr_broker_id: {
          type: 'string',
          id: 28,
          options: {
            proto3_optional: true
          }
        },
        ofr_broker_percent: {
          type: 'int32',
          id: 29,
          options: {
            proto3_optional: true
          }
        },
        nothing_done: {
          type: 'bool',
          id: 30,
          options: {
            proto3_optional: true
          }
        },
        operation_type: {
          type: 'OperationTypeEnum',
          id: 31,
          options: {
            proto3_optional: true
          }
        },
        enable: {
          type: 'EnableEnum',
          id: 32,
          options: {
            proto3_optional: true
          }
        },
        bid_trader_tag: {
          type: 'string',
          id: 33,
          options: {
            proto3_optional: true
          }
        },
        ofr_trader_tag: {
          type: 'string',
          id: 34,
          options: {
            proto3_optional: true
          }
        },
        flag_intention: {
          type: 'bool',
          id: 35,
          options: {
            proto3_optional: true
          }
        },
        last_action_type: {
          type: 'MarketDealLastActionTypeEnum',
          id: 36,
          options: {
            proto3_optional: true
          }
        },
        join_count: {
          type: 'int32',
          id: 37,
          options: {
            proto3_optional: true
          }
        },
        exercise_manual: {
          type: 'bool',
          id: 38,
          options: {
            proto3_optional: true
          }
        },
        settlement_amount: {
          type: 'double',
          id: 39,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    InstRatingStruct: {
      oneofs: {
        _create_time: {
          oneof: ['create_time']
        },
        _update_time: {
          oneof: ['update_time']
        },
        _inst_code: {
          oneof: ['inst_code']
        },
        _inst_type: {
          oneof: ['inst_type']
        },
        _rating_inst_code: {
          oneof: ['rating_inst_code']
        },
        _rating_date: {
          oneof: ['rating_date']
        },
        _rate: {
          oneof: ['rate']
        },
        _outlook: {
          oneof: ['outlook']
        },
        _inputer: {
          oneof: ['inputer']
        },
        _inst_name: {
          oneof: ['inst_name']
        },
        _rate_val: {
          oneof: ['rate_val']
        }
      },
      fields: {
        rating_id: {
          type: 'string',
          id: 1
        },
        enable: {
          type: 'EnableEnum',
          id: 2
        },
        create_time: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        update_time: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        inst_code: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        inst_type: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        rating_inst_code: {
          type: 'string',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        rating_date: {
          type: 'string',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        rate: {
          type: 'RatingEnum',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        outlook: {
          type: 'string',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        inputer: {
          type: 'string',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        inst_name: {
          type: 'string',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        rate_val: {
          type: 'string',
          id: 13,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    CityStruct: {
      fields: {
        city_name_zh: {
          type: 'string',
          id: 1
        },
        city_name_en: {
          type: 'string',
          id: 2
        },
        city_code: {
          type: 'string',
          id: 3
        }
      }
    },
    ProvinceStruct: {
      fields: {
        province_name_zh: {
          type: 'string',
          id: 1
        },
        province_name_en: {
          type: 'string',
          id: 2
        },
        province_code: {
          type: 'string',
          id: 3
        },
        cities: {
          rule: 'repeated',
          type: 'CityStruct',
          id: 4
        }
      }
    },
    SubsectorStruct: {
      fields: {
        subsector_name_zh: {
          type: 'string',
          id: 1
        },
        subsector_name_en: {
          type: 'string',
          id: 2
        },
        subsector_code: {
          type: 'string',
          id: 3
        }
      }
    },
    SectorStruct: {
      fields: {
        sector_name_zh: {
          type: 'string',
          id: 1
        },
        sector_name_en: {
          type: 'string',
          id: 2
        },
        sector_code: {
          type: 'string',
          id: 3
        },
        subsectors: {
          rule: 'repeated',
          type: 'SubsectorStruct',
          id: 4
        }
      }
    },
    InstInfoStruct: {
      oneofs: {
        _inst_type: {
          oneof: ['inst_type']
        }
      },
      fields: {
        inst_id: {
          type: 'string',
          id: 1
        },
        inst_code: {
          type: 'string',
          id: 2
        },
        full_name_zh: {
          type: 'string',
          id: 3
        },
        short_name_zh: {
          type: 'string',
          id: 4
        },
        pinyin: {
          type: 'string',
          id: 5
        },
        pinyin_full: {
          type: 'string',
          id: 6
        },
        inst_type: {
          type: 'string',
          id: 7,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    LiquidationSpeedStruct: {
      oneofs: {
        _tag: {
          oneof: ['tag']
        },
        _date: {
          oneof: ['date']
        }
      },
      fields: {
        offset: {
          type: 'int32',
          id: 1
        },
        tag: {
          type: 'LiquidationSpeedTagEnum',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        date: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    WeekdayItemStruct: {
      oneofs: {
        _listed_market: {
          oneof: ['listed_market']
        },
        _with_today: {
          oneof: ['with_today']
        }
      },
      fields: {
        target_date: {
          type: 'string',
          id: 1
        },
        listed_market: {
          type: 'ListedMarketEnum',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        with_today: {
          type: 'bool',
          id: 3,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    IssuerStruct: {
      oneofs: {
        _issuer_type: {
          oneof: ['issuer_type']
        },
        _inst_type: {
          oneof: ['inst_type']
        },
        _inst_subtype: {
          oneof: ['inst_subtype']
        },
        _inst_rating: {
          oneof: ['inst_rating']
        },
        _short_name_zh: {
          oneof: ['short_name_zh']
        },
        _full_name_en: {
          oneof: ['full_name_en']
        },
        _short_name_en: {
          oneof: ['short_name_en']
        },
        _country: {
          oneof: ['country']
        },
        _province: {
          oneof: ['province']
        },
        _province_code: {
          oneof: ['province_code']
        },
        _city: {
          oneof: ['city']
        },
        _largest_shareholder: {
          oneof: ['largest_shareholder']
        },
        _legal_representative: {
          oneof: ['legal_representative']
        },
        _registered_capital: {
          oneof: ['registered_capital']
        },
        _registered_capital_currency: {
          oneof: ['registered_capital_currency']
        },
        _registered_address: {
          oneof: ['registered_address']
        },
        _regd_num: {
          oneof: ['regd_num']
        },
        _business_scope: {
          oneof: ['business_scope']
        },
        _main_product: {
          oneof: ['main_product']
        },
        _rating: {
          oneof: ['rating']
        },
        _rating_inst_code: {
          oneof: ['rating_inst_code']
        },
        _former_name: {
          oneof: ['former_name']
        },
        _org_type: {
          oneof: ['org_type']
        },
        _sw_sector: {
          oneof: ['sw_sector']
        },
        _sw_sector_code: {
          oneof: ['sw_sector_code']
        },
        _sw_subsector: {
          oneof: ['sw_subsector']
        },
        _sw_subsector_code: {
          oneof: ['sw_subsector_code']
        },
        _stockholder_name: {
          oneof: ['stockholder_name']
        },
        _stockholder_type: {
          oneof: ['stockholder_type']
        },
        _stockholding_percentage: {
          oneof: ['stockholding_percentage']
        },
        _actual_controller_name: {
          oneof: ['actual_controller_name']
        },
        _actual_controller_type: {
          oneof: ['actual_controller_type']
        },
        _ultimate_actual_controller_name: {
          oneof: ['ultimate_actual_controller_name']
        },
        _ultimate_actual_controller_type: {
          oneof: ['ultimate_actual_controller_type']
        },
        _cbrc_financing_platform: {
          oneof: ['cbrc_financing_platform']
        },
        _endowment: {
          oneof: ['endowment']
        },
        _orgnization_code: {
          oneof: ['orgnization_code']
        },
        _uni_code: {
          oneof: ['uni_code']
        },
        _municipal_code: {
          oneof: ['municipal_code']
        },
        _is_municipal: {
          oneof: ['is_municipal']
        },
        _municipal_business: {
          oneof: ['municipal_business']
        },
        _area_level: {
          oneof: ['area_level']
        },
        _listed_type: {
          oneof: ['listed_type']
        },
        _cbc_rating: {
          oneof: ['cbc_rating']
        },
        _cbc_outlook: {
          oneof: ['cbc_outlook']
        }
      },
      fields: {
        issuer_id: {
          type: 'string',
          id: 1
        },
        issuer_name: {
          type: 'string',
          id: 2
        },
        issuer_type: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        inst_code: {
          type: 'string',
          id: 4
        },
        inst_type: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        inst_subtype: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        inst_rating: {
          type: 'string',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        establishment_date: {
          type: 'string',
          id: 8
        },
        full_name_zh: {
          type: 'string',
          id: 9
        },
        short_name_zh: {
          type: 'string',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        full_name_en: {
          type: 'string',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        short_name_en: {
          type: 'string',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        pin_yin: {
          type: 'string',
          id: 13
        },
        pin_yin_full: {
          type: 'string',
          id: 14
        },
        country: {
          type: 'string',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        province: {
          type: 'string',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        province_code: {
          type: 'string',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        city: {
          type: 'string',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        largest_shareholder: {
          type: 'string',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        legal_representative: {
          type: 'string',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        registered_capital: {
          type: 'string',
          id: 21,
          options: {
            proto3_optional: true
          }
        },
        registered_capital_currency: {
          type: 'string',
          id: 22,
          options: {
            proto3_optional: true
          }
        },
        registered_address: {
          type: 'string',
          id: 23,
          options: {
            proto3_optional: true
          }
        },
        regd_num: {
          type: 'string',
          id: 24,
          options: {
            proto3_optional: true
          }
        },
        business_scope: {
          type: 'string',
          id: 25,
          options: {
            proto3_optional: true
          }
        },
        main_product: {
          type: 'string',
          id: 26,
          options: {
            proto3_optional: true
          }
        },
        rating: {
          type: 'string',
          id: 27,
          options: {
            proto3_optional: true
          }
        },
        rating_inst_code: {
          type: 'string',
          id: 28,
          options: {
            proto3_optional: true
          }
        },
        former_name: {
          type: 'string',
          id: 29,
          options: {
            proto3_optional: true
          }
        },
        org_type: {
          type: 'string',
          id: 30,
          options: {
            proto3_optional: true
          }
        },
        sw_sector: {
          type: 'string',
          id: 31,
          options: {
            proto3_optional: true
          }
        },
        sw_sector_code: {
          type: 'string',
          id: 32,
          options: {
            proto3_optional: true
          }
        },
        sw_subsector: {
          type: 'string',
          id: 33,
          options: {
            proto3_optional: true
          }
        },
        sw_subsector_code: {
          type: 'string',
          id: 34,
          options: {
            proto3_optional: true
          }
        },
        stockholder_name: {
          type: 'string',
          id: 35,
          options: {
            proto3_optional: true
          }
        },
        stockholder_type: {
          type: 'string',
          id: 36,
          options: {
            proto3_optional: true
          }
        },
        stockholding_percentage: {
          type: 'string',
          id: 37,
          options: {
            proto3_optional: true
          }
        },
        actual_controller_name: {
          type: 'string',
          id: 38,
          options: {
            proto3_optional: true
          }
        },
        actual_controller_type: {
          type: 'string',
          id: 39,
          options: {
            proto3_optional: true
          }
        },
        ultimate_actual_controller_name: {
          type: 'string',
          id: 40,
          options: {
            proto3_optional: true
          }
        },
        ultimate_actual_controller_type: {
          type: 'string',
          id: 41,
          options: {
            proto3_optional: true
          }
        },
        cbrc_financing_platform: {
          type: 'bool',
          id: 42,
          options: {
            proto3_optional: true
          }
        },
        endowment: {
          type: 'string',
          id: 43,
          options: {
            proto3_optional: true
          }
        },
        orgnization_code: {
          type: 'string',
          id: 44,
          options: {
            proto3_optional: true
          }
        },
        uni_code: {
          type: 'string',
          id: 45,
          options: {
            proto3_optional: true
          }
        },
        municipal_code: {
          type: 'string',
          id: 46,
          options: {
            proto3_optional: true
          }
        },
        is_municipal: {
          type: 'bool',
          id: 47,
          options: {
            proto3_optional: true
          }
        },
        municipal_business: {
          type: 'bool',
          id: 48,
          options: {
            proto3_optional: true
          }
        },
        area_level: {
          type: 'string',
          id: 49,
          options: {
            proto3_optional: true
          }
        },
        listed_type: {
          type: 'string',
          id: 50,
          options: {
            proto3_optional: true
          }
        },
        cbc_rating: {
          type: 'string',
          id: 51,
          options: {
            proto3_optional: true
          }
        },
        cbc_outlook: {
          type: 'string',
          id: 52,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    IssuerLiteStruct: {
      oneofs: {
        _issuer_id: {
          oneof: ['issuer_id']
        },
        _issuer_name: {
          oneof: ['issuer_name']
        },
        _inst_code: {
          oneof: ['inst_code']
        },
        _full_name_zh: {
          oneof: ['full_name_zh']
        },
        _short_name_zh: {
          oneof: ['short_name_zh']
        },
        _bank_type: {
          oneof: ['bank_type']
        }
      },
      fields: {
        issuer_id: {
          type: 'string',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        issuer_name: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        inst_code: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        full_name_zh: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        short_name_zh: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        bank_type: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    BondBenchmarkRateStruct: {
      fields: {
        value: {
          type: 'double',
          id: 1
        },
        name: {
          type: 'string',
          id: 2
        },
        latest_index_date: {
          type: 'string',
          id: 3
        }
      }
    },
    BondRatingStruct: {
      oneofs: {
        _rating_institution_code: {
          oneof: ['rating_institution_code']
        },
        _rating_reason: {
          oneof: ['rating_reason']
        },
        _rating_source: {
          oneof: ['rating_source']
        },
        _outlook: {
          oneof: ['outlook']
        },
        _rating_institution_name: {
          oneof: ['rating_institution_name']
        }
      },
      fields: {
        bond_rating_id: {
          type: 'string',
          id: 1
        },
        bond_key: {
          type: 'string',
          id: 2
        },
        rating_institution_code: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        rating_date: {
          type: 'string',
          id: 4
        },
        bond_rating: {
          type: 'string',
          id: 5
        },
        rating_reason: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        rating_source: {
          type: 'string',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        outlook: {
          type: 'string',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        rating_institution_name: {
          type: 'string',
          id: 9,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    BondQuoteSyncStruct: {
      oneofs: {
        _exercise_manual: {
          oneof: ['exercise_manual']
        }
      },
      fields: {
        quote_id: {
          type: 'string',
          id: 1
        },
        bond_key_market: {
          type: 'string',
          id: 2
        },
        update_time: {
          type: 'string',
          id: 3
        },
        create_time: {
          type: 'string',
          id: 4
        },
        product_type: {
          type: 'ProductTypeEnum',
          id: 5
        },
        volume: {
          type: 'double',
          id: 6
        },
        yield: {
          type: 'double',
          id: 7
        },
        clean_price: {
          type: 'double',
          id: 8
        },
        full_price: {
          type: 'double',
          id: 9
        },
        return_point: {
          type: 'double',
          id: 10
        },
        flag_rebate: {
          type: 'bool',
          id: 11
        },
        side: {
          type: 'SideEnum',
          id: 12
        },
        quote_type: {
          type: 'BondQuoteTypeEnum',
          id: 13
        },
        liquidation_speed_list: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 14
        },
        inst_info: {
          type: 'InstitutionTinyStruct',
          id: 15
        },
        trader_info: {
          type: 'TraderLiteStruct',
          id: 16
        },
        broker_info: {
          type: 'BrokerStruct',
          id: 17
        },
        operator_info: {
          type: 'BrokerStruct',
          id: 18
        },
        flag_urgent: {
          type: 'bool',
          id: 19
        },
        flag_star: {
          type: 'int32',
          id: 20
        },
        flag_package: {
          type: 'bool',
          id: 21
        },
        flag_oco: {
          type: 'bool',
          id: 22
        },
        flag_exchange: {
          type: 'bool',
          id: 23
        },
        flag_stock_exchange: {
          type: 'bool',
          id: 24
        },
        is_exercise: {
          type: 'bool',
          id: 25
        },
        flag_intention: {
          type: 'bool',
          id: 26
        },
        flag_indivisible: {
          type: 'bool',
          id: 27
        },
        flag_stc: {
          type: 'bool',
          id: 28
        },
        comment: {
          type: 'string',
          id: 29
        },
        sync_version: {
          type: 'string',
          id: 30
        },
        flag_internal: {
          type: 'bool',
          id: 31
        },
        spread: {
          type: 'double',
          id: 32
        },
        quote_price: {
          type: 'double',
          id: 33
        },
        inst_biz_short_name_list: {
          rule: 'repeated',
          type: 'string',
          id: 34
        },
        flag_request: {
          type: 'bool',
          id: 35
        },
        flag_bilateral: {
          type: 'bool',
          id: 36
        },
        exercise_manual: {
          type: 'bool',
          id: 37,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    QuoteSyncStruct: {
      oneofs: {
        _bond_key_market: {
          oneof: ['bond_key_market']
        },
        _update_time: {
          oneof: ['update_time']
        },
        _create_time: {
          oneof: ['create_time']
        },
        _product_type: {
          oneof: ['product_type']
        },
        _volume: {
          oneof: ['volume']
        },
        _yield: {
          oneof: ['yield']
        },
        _clean_price: {
          oneof: ['clean_price']
        },
        _full_price: {
          oneof: ['full_price']
        },
        _return_point: {
          oneof: ['return_point']
        },
        _flag_rebate: {
          oneof: ['flag_rebate']
        },
        _side: {
          oneof: ['side']
        },
        _quote_type: {
          oneof: ['quote_type']
        },
        _inst_id: {
          oneof: ['inst_id']
        },
        _trader_id: {
          oneof: ['trader_id']
        },
        _broker_id: {
          oneof: ['broker_id']
        },
        _operator: {
          oneof: ['operator']
        },
        _flag_urgent: {
          oneof: ['flag_urgent']
        },
        _flag_star: {
          oneof: ['flag_star']
        },
        _flag_package: {
          oneof: ['flag_package']
        },
        _flag_oco: {
          oneof: ['flag_oco']
        },
        _flag_exchange: {
          oneof: ['flag_exchange']
        },
        _flag_stock_exchange: {
          oneof: ['flag_stock_exchange']
        },
        _is_exercise: {
          oneof: ['is_exercise']
        },
        _flag_intention: {
          oneof: ['flag_intention']
        },
        _flag_indivisible: {
          oneof: ['flag_indivisible']
        },
        _flag_stc: {
          oneof: ['flag_stc']
        },
        _comment: {
          oneof: ['comment']
        },
        _sync_version: {
          oneof: ['sync_version']
        },
        _flag_internal: {
          oneof: ['flag_internal']
        },
        _spread: {
          oneof: ['spread']
        },
        _quote_price: {
          oneof: ['quote_price']
        },
        _flag_request: {
          oneof: ['flag_request']
        },
        _flag_bilateral: {
          oneof: ['flag_bilateral']
        },
        _enable: {
          oneof: ['enable']
        },
        _trader_tag: {
          oneof: ['trader_tag']
        },
        _exercise_manual: {
          oneof: ['exercise_manual']
        }
      },
      fields: {
        quote_id: {
          type: 'string',
          id: 1
        },
        bond_key_market: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        update_time: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        create_time: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        product_type: {
          type: 'ProductTypeEnum',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        volume: {
          type: 'double',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        yield: {
          type: 'double',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        clean_price: {
          type: 'double',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        full_price: {
          type: 'double',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        return_point: {
          type: 'double',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        flag_rebate: {
          type: 'bool',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        side: {
          type: 'SideEnum',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        quote_type: {
          type: 'BondQuoteTypeEnum',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        liquidation_speed_list: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 14
        },
        inst_id: {
          type: 'string',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        trader_id: {
          type: 'string',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        broker_id: {
          type: 'string',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        operator: {
          type: 'string',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        flag_urgent: {
          type: 'bool',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        flag_star: {
          type: 'int32',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        flag_package: {
          type: 'bool',
          id: 21,
          options: {
            proto3_optional: true
          }
        },
        flag_oco: {
          type: 'bool',
          id: 22,
          options: {
            proto3_optional: true
          }
        },
        flag_exchange: {
          type: 'bool',
          id: 23,
          options: {
            proto3_optional: true
          }
        },
        flag_stock_exchange: {
          type: 'bool',
          id: 24,
          options: {
            proto3_optional: true
          }
        },
        is_exercise: {
          type: 'bool',
          id: 25,
          options: {
            proto3_optional: true
          }
        },
        flag_intention: {
          type: 'bool',
          id: 26,
          options: {
            proto3_optional: true
          }
        },
        flag_indivisible: {
          type: 'bool',
          id: 27,
          options: {
            proto3_optional: true
          }
        },
        flag_stc: {
          type: 'bool',
          id: 28,
          options: {
            proto3_optional: true
          }
        },
        comment: {
          type: 'string',
          id: 29,
          options: {
            proto3_optional: true
          }
        },
        sync_version: {
          type: 'string',
          id: 30,
          options: {
            proto3_optional: true
          }
        },
        flag_internal: {
          type: 'bool',
          id: 31,
          options: {
            proto3_optional: true
          }
        },
        spread: {
          type: 'double',
          id: 32,
          options: {
            proto3_optional: true
          }
        },
        quote_price: {
          type: 'double',
          id: 33,
          options: {
            proto3_optional: true
          }
        },
        flag_request: {
          type: 'bool',
          id: 34,
          options: {
            proto3_optional: true
          }
        },
        flag_bilateral: {
          type: 'bool',
          id: 35,
          options: {
            proto3_optional: true
          }
        },
        enable: {
          type: 'EnableEnum',
          id: 36,
          options: {
            proto3_optional: true
          }
        },
        trader_tag: {
          type: 'string',
          id: 37,
          options: {
            proto3_optional: true
          }
        },
        exercise_manual: {
          type: 'bool',
          id: 38,
          options: {
            proto3_optional: true
          }
        },
        deal_liquidation_speed_list: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 39
        }
      }
    },
    QuoteDetailStruct: {
      oneofs: {
        _sync_version: {
          oneof: ['sync_version']
        },
        _create_time: {
          oneof: ['create_time']
        },
        _update_time: {
          oneof: ['update_time']
        },
        _bond_key_market: {
          oneof: ['bond_key_market']
        },
        _bond_id: {
          oneof: ['bond_id']
        },
        _broker_id: {
          oneof: ['broker_id']
        },
        _trader_id: {
          oneof: ['trader_id']
        },
        _inst_id: {
          oneof: ['inst_id']
        },
        _side: {
          oneof: ['side']
        },
        _quote_type: {
          oneof: ['quote_type']
        },
        _offset: {
          oneof: ['offset']
        },
        _price: {
          oneof: ['price']
        },
        _yield: {
          oneof: ['yield']
        },
        _clean_price: {
          oneof: ['clean_price']
        },
        _full_price: {
          oneof: ['full_price']
        },
        _spread: {
          oneof: ['spread']
        },
        _return_point: {
          oneof: ['return_point']
        },
        _volume: {
          oneof: ['volume']
        },
        _is_vip: {
          oneof: ['is_vip']
        },
        _is_danger: {
          oneof: ['is_danger']
        },
        _is_bargain: {
          oneof: ['is_bargain']
        },
        _flag_internal: {
          oneof: ['flag_internal']
        },
        _flag_urgent: {
          oneof: ['flag_urgent']
        },
        _flag_exchange: {
          oneof: ['flag_exchange']
        },
        _flag_star: {
          oneof: ['flag_star']
        },
        _flag_oco: {
          oneof: ['flag_oco']
        },
        _flag_package: {
          oneof: ['flag_package']
        },
        _flag_rebate: {
          oneof: ['flag_rebate']
        },
        _flag_recommend: {
          oneof: ['flag_recommend']
        },
        _almost_done: {
          oneof: ['almost_done']
        },
        _flag_intention: {
          oneof: ['flag_intention']
        },
        _is_exercise: {
          oneof: ['is_exercise']
        },
        _exercise_manual: {
          oneof: ['exercise_manual']
        },
        _is_lead: {
          oneof: ['is_lead']
        },
        _comment: {
          oneof: ['comment']
        },
        _flag_stock_exchange: {
          oneof: ['flag_stock_exchange']
        },
        _flag_bilateral: {
          oneof: ['flag_bilateral']
        },
        _flag_request: {
          oneof: ['flag_request']
        },
        _flag_indivisible: {
          oneof: ['flag_indivisible']
        },
        _flag_stc: {
          oneof: ['flag_stc']
        },
        _liquidation_speed_list: {
          oneof: ['liquidation_speed_list']
        },
        _idc_liquidation_speed_list: {
          oneof: ['idc_liquidation_speed_list']
        },
        _operator: {
          oneof: ['operator']
        },
        _trader_tag: {
          oneof: ['trader_tag']
        },
        _refer_time: {
          oneof: ['refer_time']
        },
        _latest_traded_date: {
          oneof: ['latest_traded_date']
        },
        _first_delivery_date: {
          oneof: ['first_delivery_date']
        },
        _source: {
          oneof: ['source']
        },
        _refer_type: {
          oneof: ['refer_type']
        },
        _enable: {
          oneof: ['enable']
        },
        _bond_code: {
          oneof: ['bond_code']
        },
        _bond_type: {
          oneof: ['bond_type']
        },
        _bond_short_name: {
          oneof: ['bond_short_name']
        },
        _bond_key: {
          oneof: ['bond_key']
        },
        _listed_market: {
          oneof: ['listed_market']
        },
        _ent_cor: {
          oneof: ['ent_cor']
        },
        _val_modified_duration: {
          oneof: ['val_modified_duration']
        },
        _frn_index_id: {
          oneof: ['frn_index_id']
        },
        _coupon_type: {
          oneof: ['coupon_type']
        },
        _option_type: {
          oneof: ['option_type']
        },
        _mkt_type: {
          oneof: ['mkt_type']
        },
        _maturity_is_holiday: {
          oneof: ['maturity_is_holiday']
        },
        _product_type: {
          oneof: ['product_type']
        },
        _selective_code: {
          oneof: ['selective_code']
        },
        _asset_status: {
          oneof: ['asset_status']
        },
        _is_mortgage: {
          oneof: ['is_mortgage']
        },
        _is_cross_mkt: {
          oneof: ['is_cross_mkt']
        },
        _ficc_type_code: {
          oneof: ['ficc_type_code']
        },
        _bond_ficc_type: {
          oneof: ['bond_ficc_type']
        },
        _warranter: {
          oneof: ['warranter']
        },
        _is_municipal: {
          oneof: ['is_municipal']
        },
        _term_structure: {
          oneof: ['term_structure']
        },
        _bond_full_name: {
          oneof: ['bond_full_name']
        },
        _redemption_no: {
          oneof: ['redemption_no']
        },
        _sceniority: {
          oneof: ['sceniority']
        },
        _conversion_rate: {
          oneof: ['conversion_rate']
        },
        _issuer_code: {
          oneof: ['issuer_code']
        },
        _issuer_name: {
          oneof: ['issuer_name']
        },
        _institution_subtype: {
          oneof: ['institution_subtype']
        },
        _cbrc_financing_platform: {
          oneof: ['cbrc_financing_platform']
        },
        _province: {
          oneof: ['province']
        },
        _city: {
          oneof: ['city']
        },
        _issue_year: {
          oneof: ['issue_year']
        },
        _sw_sector: {
          oneof: ['sw_sector']
        },
        _sw_subsector: {
          oneof: ['sw_subsector']
        },
        _maturity_date: {
          oneof: ['maturity_date']
        },
        _first_maturity_date: {
          oneof: ['first_maturity_date']
        },
        _listed_date: {
          oneof: ['listed_date']
        },
        _delisted_date: {
          oneof: ['delisted_date']
        },
        _interest_start_date: {
          oneof: ['interest_start_date']
        },
        _option_date: {
          oneof: ['option_date']
        },
        _underwriter_code: {
          oneof: ['underwriter_code']
        },
        _area_level: {
          oneof: ['area_level']
        },
        _inst_type: {
          oneof: ['inst_type']
        },
        _inst_listed_type: {
          oneof: ['inst_listed_type']
        },
        _bond_category: {
          oneof: ['bond_category']
        },
        _bond_sector: {
          oneof: ['bond_sector']
        },
        _fr_type: {
          oneof: ['fr_type']
        },
        _perp_type: {
          oneof: ['perp_type']
        },
        _has_option: {
          oneof: ['has_option']
        },
        _val_yield: {
          oneof: ['val_yield']
        },
        _val_clean_price_exe: {
          oneof: ['val_clean_price_exe']
        },
        _val_clean_price_mat: {
          oneof: ['val_clean_price_mat']
        },
        _val_yield_exe: {
          oneof: ['val_yield_exe']
        },
        _val_yield_mat: {
          oneof: ['val_yield_mat']
        },
        _val_clean_price: {
          oneof: ['val_clean_price']
        },
        _val_convexity: {
          oneof: ['val_convexity']
        },
        _val_basis_point_value: {
          oneof: ['val_basis_point_value']
        },
        _csi_clean_price: {
          oneof: ['csi_clean_price']
        },
        _csi_full_price: {
          oneof: ['csi_full_price']
        },
        _csi_yield: {
          oneof: ['csi_yield']
        },
        _coupon_rate_current: {
          oneof: ['coupon_rate_current']
        },
        _operator_name: {
          oneof: ['operator_name']
        },
        _trader_name: {
          oneof: ['trader_name']
        },
        _broker_name_pinyin: {
          oneof: ['broker_name_pinyin']
        },
        _operator_name_pinyin: {
          oneof: ['operator_name_pinyin']
        },
        _bond_short_name_pinyin: {
          oneof: ['bond_short_name_pinyin']
        },
        _bond_short_name_pinyin_full: {
          oneof: ['bond_short_name_pinyin_full']
        },
        _trader_name_pinyin: {
          oneof: ['trader_name_pinyin']
        },
        _inst_short_name_zh: {
          oneof: ['inst_short_name_zh']
        },
        _inst_biz_short_name_list: {
          oneof: ['inst_biz_short_name_list']
        },
        _broker_name: {
          oneof: ['broker_name']
        },
        _repayment_method: {
          oneof: ['repayment_method']
        },
        _bond_rating_str: {
          oneof: ['bond_rating_str']
        },
        _issuer_rating_str: {
          oneof: ['issuer_rating_str']
        },
        _cbc_rating_str: {
          oneof: ['cbc_rating_str']
        },
        _inst_rating_str: {
          oneof: ['inst_rating_str']
        },
        _implied_rating_str: {
          oneof: ['implied_rating_str']
        },
        _bond_rating_score: {
          oneof: ['bond_rating_score']
        },
        _issuer_rating_score: {
          oneof: ['issuer_rating_score']
        },
        _cbc_rating_score: {
          oneof: ['cbc_rating_score']
        },
        _inst_rating_score: {
          oneof: ['inst_rating_score']
        },
        _implied_rating_score: {
          oneof: ['implied_rating_score']
        },
        _call_str: {
          oneof: ['call_str']
        },
        _put_str: {
          oneof: ['put_str']
        },
        _is_gn: {
          oneof: ['is_gn']
        },
        _rating_augment: {
          oneof: ['rating_augment']
        },
        _bond_display_code: {
          oneof: ['bond_display_code']
        },
        _ncd_subtype: {
          oneof: ['ncd_subtype']
        }
      },
      fields: {
        quote_id: {
          type: 'string',
          id: 1
        },
        sync_version: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        create_time: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        update_time: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        bond_key_market: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        bond_id: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        broker_id: {
          type: 'string',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        trader_id: {
          type: 'string',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        inst_id: {
          type: 'string',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        side: {
          type: 'int32',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        quote_type: {
          type: 'int32',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        offset: {
          type: 'double',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        price: {
          type: 'double',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        yield: {
          type: 'double',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        clean_price: {
          type: 'double',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        full_price: {
          type: 'double',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        spread: {
          type: 'double',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        return_point: {
          type: 'double',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        volume: {
          type: 'double',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        is_vip: {
          type: 'bool',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        is_danger: {
          type: 'bool',
          id: 21,
          options: {
            proto3_optional: true
          }
        },
        is_bargain: {
          type: 'bool',
          id: 22,
          options: {
            proto3_optional: true
          }
        },
        flag_internal: {
          type: 'bool',
          id: 23,
          options: {
            proto3_optional: true
          }
        },
        flag_urgent: {
          type: 'bool',
          id: 24,
          options: {
            proto3_optional: true
          }
        },
        flag_exchange: {
          type: 'bool',
          id: 25,
          options: {
            proto3_optional: true
          }
        },
        flag_star: {
          type: 'int32',
          id: 26,
          options: {
            proto3_optional: true
          }
        },
        flag_oco: {
          type: 'bool',
          id: 27,
          options: {
            proto3_optional: true
          }
        },
        flag_package: {
          type: 'bool',
          id: 28,
          options: {
            proto3_optional: true
          }
        },
        flag_rebate: {
          type: 'bool',
          id: 29,
          options: {
            proto3_optional: true
          }
        },
        flag_recommend: {
          type: 'bool',
          id: 30,
          options: {
            proto3_optional: true
          }
        },
        almost_done: {
          type: 'bool',
          id: 31,
          options: {
            proto3_optional: true
          }
        },
        flag_intention: {
          type: 'bool',
          id: 32,
          options: {
            proto3_optional: true
          }
        },
        is_exercise: {
          type: 'bool',
          id: 33,
          options: {
            proto3_optional: true
          }
        },
        exercise_manual: {
          type: 'bool',
          id: 34,
          options: {
            proto3_optional: true
          }
        },
        is_lead: {
          type: 'bool',
          id: 35,
          options: {
            proto3_optional: true
          }
        },
        comment: {
          type: 'string',
          id: 36,
          options: {
            proto3_optional: true
          }
        },
        flag_stock_exchange: {
          type: 'bool',
          id: 37,
          options: {
            proto3_optional: true
          }
        },
        flag_bilateral: {
          type: 'bool',
          id: 38,
          options: {
            proto3_optional: true
          }
        },
        flag_request: {
          type: 'bool',
          id: 39,
          options: {
            proto3_optional: true
          }
        },
        flag_indivisible: {
          type: 'bool',
          id: 40,
          options: {
            proto3_optional: true
          }
        },
        flag_stc: {
          type: 'bool',
          id: 41,
          options: {
            proto3_optional: true
          }
        },
        liquidation_speed_list: {
          type: 'string',
          id: 42,
          options: {
            proto3_optional: true
          }
        },
        idc_liquidation_speed_list: {
          type: 'string',
          id: 43,
          options: {
            proto3_optional: true
          }
        },
        operator: {
          type: 'string',
          id: 44,
          options: {
            proto3_optional: true
          }
        },
        trader_tag: {
          type: 'string',
          id: 45,
          options: {
            proto3_optional: true
          }
        },
        refer_time: {
          type: 'string',
          id: 46,
          options: {
            proto3_optional: true
          }
        },
        latest_traded_date: {
          type: 'string',
          id: 47,
          options: {
            proto3_optional: true
          }
        },
        first_delivery_date: {
          type: 'string',
          id: 48,
          options: {
            proto3_optional: true
          }
        },
        source: {
          type: 'int32',
          id: 49,
          options: {
            proto3_optional: true
          }
        },
        refer_type: {
          type: 'int32',
          id: 50,
          options: {
            proto3_optional: true
          }
        },
        enable: {
          type: 'int32',
          id: 51,
          options: {
            proto3_optional: true
          }
        },
        bond_code: {
          type: 'string',
          id: 52,
          options: {
            proto3_optional: true
          }
        },
        bond_type: {
          type: 'string',
          id: 53,
          options: {
            proto3_optional: true
          }
        },
        bond_short_name: {
          type: 'string',
          id: 54,
          options: {
            proto3_optional: true
          }
        },
        bond_key: {
          type: 'string',
          id: 55,
          options: {
            proto3_optional: true
          }
        },
        listed_market: {
          type: 'string',
          id: 56,
          options: {
            proto3_optional: true
          }
        },
        ent_cor: {
          type: 'string',
          id: 57,
          options: {
            proto3_optional: true
          }
        },
        val_modified_duration: {
          type: 'double',
          id: 58,
          options: {
            proto3_optional: true
          }
        },
        frn_index_id: {
          type: 'string',
          id: 59,
          options: {
            proto3_optional: true
          }
        },
        coupon_type: {
          type: 'string',
          id: 60,
          options: {
            proto3_optional: true
          }
        },
        option_type: {
          type: 'string',
          id: 61,
          options: {
            proto3_optional: true
          }
        },
        mkt_type: {
          type: 'int32',
          id: 62,
          options: {
            proto3_optional: true
          }
        },
        maturity_is_holiday: {
          type: 'bool',
          id: 63,
          options: {
            proto3_optional: true
          }
        },
        product_type: {
          type: 'string',
          id: 64,
          options: {
            proto3_optional: true
          }
        },
        selective_code: {
          type: 'string',
          id: 65,
          options: {
            proto3_optional: true
          }
        },
        asset_status: {
          type: 'string',
          id: 66,
          options: {
            proto3_optional: true
          }
        },
        is_mortgage: {
          type: 'bool',
          id: 67,
          options: {
            proto3_optional: true
          }
        },
        is_cross_mkt: {
          type: 'bool',
          id: 68,
          options: {
            proto3_optional: true
          }
        },
        ficc_type_code: {
          type: 'string',
          id: 69,
          options: {
            proto3_optional: true
          }
        },
        bond_ficc_type: {
          type: 'string',
          id: 70,
          options: {
            proto3_optional: true
          }
        },
        warranter: {
          type: 'string',
          id: 71,
          options: {
            proto3_optional: true
          }
        },
        is_municipal: {
          type: 'bool',
          id: 72,
          options: {
            proto3_optional: true
          }
        },
        term_structure: {
          type: 'string',
          id: 73,
          options: {
            proto3_optional: true
          }
        },
        bond_full_name: {
          type: 'string',
          id: 74,
          options: {
            proto3_optional: true
          }
        },
        redemption_no: {
          type: 'int32',
          id: 75,
          options: {
            proto3_optional: true
          }
        },
        sceniority: {
          type: 'string',
          id: 76,
          options: {
            proto3_optional: true
          }
        },
        conversion_rate: {
          type: 'double',
          id: 77,
          options: {
            proto3_optional: true
          }
        },
        issuer_code: {
          type: 'string',
          id: 78,
          options: {
            proto3_optional: true
          }
        },
        issuer_name: {
          type: 'string',
          id: 79,
          options: {
            proto3_optional: true
          }
        },
        institution_subtype: {
          type: 'string',
          id: 80,
          options: {
            proto3_optional: true
          }
        },
        cbrc_financing_platform: {
          type: 'bool',
          id: 81,
          options: {
            proto3_optional: true
          }
        },
        province: {
          type: 'string',
          id: 82,
          options: {
            proto3_optional: true
          }
        },
        city: {
          type: 'string',
          id: 83,
          options: {
            proto3_optional: true
          }
        },
        issue_year: {
          type: 'int32',
          id: 84,
          options: {
            proto3_optional: true
          }
        },
        sw_sector: {
          type: 'string',
          id: 85,
          options: {
            proto3_optional: true
          }
        },
        sw_subsector: {
          type: 'string',
          id: 86,
          options: {
            proto3_optional: true
          }
        },
        maturity_date: {
          type: 'string',
          id: 87,
          options: {
            proto3_optional: true
          }
        },
        first_maturity_date: {
          type: 'string',
          id: 88,
          options: {
            proto3_optional: true
          }
        },
        listed_date: {
          type: 'string',
          id: 89,
          options: {
            proto3_optional: true
          }
        },
        delisted_date: {
          type: 'string',
          id: 90,
          options: {
            proto3_optional: true
          }
        },
        interest_start_date: {
          type: 'string',
          id: 91,
          options: {
            proto3_optional: true
          }
        },
        option_date: {
          type: 'string',
          id: 92,
          options: {
            proto3_optional: true
          }
        },
        underwriter_code: {
          type: 'string',
          id: 93,
          options: {
            proto3_optional: true
          }
        },
        area_level: {
          type: 'string',
          id: 94,
          options: {
            proto3_optional: true
          }
        },
        inst_type: {
          type: 'string',
          id: 95,
          options: {
            proto3_optional: true
          }
        },
        inst_listed_type: {
          type: 'string',
          id: 96,
          options: {
            proto3_optional: true
          }
        },
        bond_category: {
          type: 'int32',
          id: 97,
          options: {
            proto3_optional: true
          }
        },
        bond_sector: {
          type: 'int32',
          id: 98,
          options: {
            proto3_optional: true
          }
        },
        fr_type: {
          type: 'int32',
          id: 99,
          options: {
            proto3_optional: true
          }
        },
        perp_type: {
          type: 'int32',
          id: 100,
          options: {
            proto3_optional: true
          }
        },
        has_option: {
          type: 'bool',
          id: 101,
          options: {
            proto3_optional: true
          }
        },
        val_yield: {
          type: 'double',
          id: 102,
          options: {
            proto3_optional: true
          }
        },
        val_clean_price_exe: {
          type: 'double',
          id: 103,
          options: {
            proto3_optional: true
          }
        },
        val_clean_price_mat: {
          type: 'double',
          id: 104,
          options: {
            proto3_optional: true
          }
        },
        val_yield_exe: {
          type: 'double',
          id: 105,
          options: {
            proto3_optional: true
          }
        },
        val_yield_mat: {
          type: 'double',
          id: 106,
          options: {
            proto3_optional: true
          }
        },
        val_clean_price: {
          type: 'double',
          id: 107,
          options: {
            proto3_optional: true
          }
        },
        val_convexity: {
          type: 'double',
          id: 108,
          options: {
            proto3_optional: true
          }
        },
        val_basis_point_value: {
          type: 'double',
          id: 109,
          options: {
            proto3_optional: true
          }
        },
        csi_clean_price: {
          type: 'double',
          id: 110,
          options: {
            proto3_optional: true
          }
        },
        csi_full_price: {
          type: 'double',
          id: 111,
          options: {
            proto3_optional: true
          }
        },
        csi_yield: {
          type: 'double',
          id: 112,
          options: {
            proto3_optional: true
          }
        },
        coupon_rate_current: {
          type: 'double',
          id: 113,
          options: {
            proto3_optional: true
          }
        },
        operator_name: {
          type: 'string',
          id: 114,
          options: {
            proto3_optional: true
          }
        },
        trader_name: {
          type: 'string',
          id: 115,
          options: {
            proto3_optional: true
          }
        },
        broker_name_pinyin: {
          type: 'string',
          id: 116,
          options: {
            proto3_optional: true
          }
        },
        operator_name_pinyin: {
          type: 'string',
          id: 117,
          options: {
            proto3_optional: true
          }
        },
        bond_short_name_pinyin: {
          type: 'string',
          id: 118,
          options: {
            proto3_optional: true
          }
        },
        bond_short_name_pinyin_full: {
          type: 'string',
          id: 119,
          options: {
            proto3_optional: true
          }
        },
        trader_name_pinyin: {
          type: 'string',
          id: 120,
          options: {
            proto3_optional: true
          }
        },
        inst_short_name_zh: {
          type: 'string',
          id: 121,
          options: {
            proto3_optional: true
          }
        },
        inst_biz_short_name_list: {
          type: 'string',
          id: 122,
          options: {
            proto3_optional: true
          }
        },
        broker_name: {
          type: 'string',
          id: 123,
          options: {
            proto3_optional: true
          }
        },
        repayment_method: {
          type: 'int32',
          id: 124,
          options: {
            proto3_optional: true
          }
        },
        bond_rating_str: {
          type: 'string',
          id: 125,
          options: {
            proto3_optional: true
          }
        },
        issuer_rating_str: {
          type: 'string',
          id: 126,
          options: {
            proto3_optional: true
          }
        },
        cbc_rating_str: {
          type: 'string',
          id: 127,
          options: {
            proto3_optional: true
          }
        },
        inst_rating_str: {
          type: 'string',
          id: 128,
          options: {
            proto3_optional: true
          }
        },
        implied_rating_str: {
          type: 'string',
          id: 129,
          options: {
            proto3_optional: true
          }
        },
        bond_rating_score: {
          type: 'int32',
          id: 130,
          options: {
            proto3_optional: true
          }
        },
        issuer_rating_score: {
          type: 'int32',
          id: 131,
          options: {
            proto3_optional: true
          }
        },
        cbc_rating_score: {
          type: 'int32',
          id: 132,
          options: {
            proto3_optional: true
          }
        },
        inst_rating_score: {
          type: 'int32',
          id: 133,
          options: {
            proto3_optional: true
          }
        },
        implied_rating_score: {
          type: 'int32',
          id: 134,
          options: {
            proto3_optional: true
          }
        },
        call_str: {
          type: 'string',
          id: 135,
          options: {
            proto3_optional: true
          }
        },
        put_str: {
          type: 'string',
          id: 136,
          options: {
            proto3_optional: true
          }
        },
        is_gn: {
          type: 'bool',
          id: 137,
          options: {
            proto3_optional: true
          }
        },
        rating_augment: {
          type: 'string',
          id: 138,
          options: {
            proto3_optional: true
          }
        },
        bond_display_code: {
          type: 'string',
          id: 139,
          options: {
            proto3_optional: true
          }
        },
        ncd_subtype: {
          type: 'string',
          id: 140,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    TraderDefaultBrokerStruct: {
      fields: {
        product_code: {
          type: 'string',
          id: 1
        },
        broker_id: {
          type: 'string',
          id: 2
        }
      }
    },
    TraderSyncStruct: {
      oneofs: {
        _name_zh: {
          oneof: ['name_zh']
        },
        _pinyin: {
          oneof: ['pinyin']
        },
        _pinyin_full: {
          oneof: ['pinyin_full']
        },
        _name_en: {
          oneof: ['name_en']
        },
        _code: {
          oneof: ['code']
        },
        _department: {
          oneof: ['department']
        },
        _position: {
          oneof: ['position']
        },
        _inst_id: {
          oneof: ['inst_id']
        },
        _qm_account: {
          oneof: ['qm_account']
        },
        _update_time: {
          oneof: ['update_time']
        },
        _enable: {
          oneof: ['enable']
        },
        _sync_version: {
          oneof: ['sync_version']
        },
        _job_status: {
          oneof: ['job_status']
        },
        _usage_status: {
          oneof: ['usage_status']
        }
      },
      fields: {
        trader_id: {
          type: 'string',
          id: 1
        },
        name_zh: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        pinyin: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        pinyin_full: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        name_en: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        code: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        department: {
          type: 'string',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        position: {
          type: 'string',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        qq: {
          rule: 'repeated',
          type: 'string',
          id: 9
        },
        product_codes: {
          rule: 'repeated',
          type: 'string',
          id: 10
        },
        tags: {
          rule: 'repeated',
          type: 'string',
          id: 11
        },
        inst_id: {
          type: 'string',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        broker_ids: {
          rule: 'repeated',
          type: 'string',
          id: 13
        },
        qm_account: {
          type: 'string',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        white_list: {
          rule: 'repeated',
          type: 'TraderWhiteListLiteStruct',
          id: 15
        },
        update_time: {
          type: 'string',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        product_marks: {
          rule: 'repeated',
          type: 'ProductMarkStruct',
          id: 17
        },
        default_broker_list: {
          rule: 'repeated',
          type: 'TraderDefaultBrokerStruct',
          id: 18
        },
        enable: {
          type: 'EnableEnum',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        sync_version: {
          type: 'string',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        job_status: {
          type: 'JobStatusEnum',
          id: 21,
          options: {
            proto3_optional: true
          }
        },
        usage_status: {
          type: 'TraderUsageStatusEnum',
          id: 22,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    UserSyncStruct: {
      oneofs: {
        _name_cn: {
          oneof: ['name_cn']
        },
        _name_en: {
          oneof: ['name_en']
        },
        _account: {
          oneof: ['account']
        },
        _post: {
          oneof: ['post']
        },
        _qq: {
          oneof: ['qq']
        },
        _qm_account: {
          oneof: ['qm_account']
        },
        _pinyin: {
          oneof: ['pinyin']
        },
        _pinyin_full: {
          oneof: ['pinyin_full']
        },
        _email: {
          oneof: ['email']
        },
        _phone: {
          oneof: ['phone']
        },
        _telephone: {
          oneof: ['telephone']
        },
        _job_num: {
          oneof: ['job_num']
        },
        _enable: {
          oneof: ['enable']
        },
        _sync_version: {
          oneof: ['sync_version']
        },
        _update_time: {
          oneof: ['update_time']
        },
        _job_status: {
          oneof: ['job_status']
        },
        _account_status: {
          oneof: ['account_status']
        }
      },
      fields: {
        user_id: {
          type: 'string',
          id: 1
        },
        name_cn: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        name_en: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        account: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        post: {
          type: 'PostEnum',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        qq: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        qm_account: {
          type: 'string',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        product_codes: {
          rule: 'repeated',
          type: 'string',
          id: 8
        },
        pinyin: {
          type: 'string',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        pinyin_full: {
          type: 'string',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        email: {
          type: 'string',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        phone: {
          type: 'string',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        telephone: {
          type: 'string',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        job_num: {
          type: 'string',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        enable: {
          type: 'EnableEnum',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        sync_version: {
          type: 'string',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        update_time: {
          type: 'string',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        job_status: {
          type: 'JobStatusEnum',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        account_status: {
          type: 'AccountStatusEnum',
          id: 19,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    InstSyncStruct: {
      oneofs: {
        _standard_code: {
          oneof: ['standard_code']
        },
        _inst_type: {
          oneof: ['inst_type']
        },
        _short_name_zh: {
          oneof: ['short_name_zh']
        },
        _full_name_zh: {
          oneof: ['full_name_zh']
        },
        _short_name_en: {
          oneof: ['short_name_en']
        },
        _full_name_en: {
          oneof: ['full_name_en']
        },
        _pinyin: {
          oneof: ['pinyin']
        },
        _pinyin_full: {
          oneof: ['pinyin_full']
        },
        _enable: {
          oneof: ['enable']
        },
        _sync_version: {
          oneof: ['sync_version']
        },
        _update_time: {
          oneof: ['update_time']
        },
        _district_id: {
          oneof: ['district_id']
        },
        _district_name: {
          oneof: ['district_name']
        },
        _inst_status: {
          oneof: ['inst_status']
        },
        _usage_status: {
          oneof: ['usage_status']
        },
        _issuer_code: {
          oneof: ['issuer_code']
        },
        _issuer_rating: {
          oneof: ['issuer_rating']
        }
      },
      fields: {
        inst_id: {
          type: 'string',
          id: 1
        },
        standard_code: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        inst_type: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        short_name_zh: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        full_name_zh: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        short_name_en: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        full_name_en: {
          type: 'string',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        pinyin: {
          type: 'string',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        pinyin_full: {
          type: 'string',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        product_codes: {
          rule: 'repeated',
          type: 'string',
          id: 10
        },
        product_short_name_set: {
          rule: 'repeated',
          type: 'BizShortNameStruct',
          id: 11
        },
        enable: {
          type: 'EnableEnum',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        sync_version: {
          type: 'string',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        update_time: {
          type: 'string',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        district_id: {
          type: 'string',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        district_name: {
          type: 'string',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        inst_status: {
          type: 'InstStatusEnum',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        usage_status: {
          type: 'UsageStatusEnum',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        issuer_code: {
          type: 'string',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        issuer_rating: {
          type: 'string',
          id: 20,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    BondBasicSyncStruct: {
      oneofs: {
        _enable: {
          oneof: ['enable']
        },
        _sync_version: {
          oneof: ['sync_version']
        },
        _update_time: {
          oneof: ['update_time']
        },
        _product_class: {
          oneof: ['product_class']
        },
        _product_type: {
          oneof: ['product_type']
        },
        _product_key: {
          oneof: ['product_key']
        },
        _product_code: {
          oneof: ['product_code']
        },
        _product_name: {
          oneof: ['product_name']
        },
        _bond_ficc_type: {
          oneof: ['bond_ficc_type']
        },
        _key_market: {
          oneof: ['key_market']
        },
        _code_market: {
          oneof: ['code_market']
        },
        _bond_code: {
          oneof: ['bond_code']
        },
        _bond_key: {
          oneof: ['bond_key']
        },
        _listed_market: {
          oneof: ['listed_market']
        },
        _listed_date: {
          oneof: ['listed_date']
        },
        _delisted_date: {
          oneof: ['delisted_date']
        },
        _full_name: {
          oneof: ['full_name']
        },
        _short_name: {
          oneof: ['short_name']
        },
        _pinyin: {
          oneof: ['pinyin']
        },
        _pinyin_full: {
          oneof: ['pinyin_full']
        },
        _selective_code: {
          oneof: ['selective_code']
        },
        _selective_name: {
          oneof: ['selective_name']
        },
        _ficc_type_code: {
          oneof: ['ficc_type_code']
        },
        _ficc_belong: {
          oneof: ['ficc_belong']
        },
        _bond_category: {
          oneof: ['bond_category']
        },
        _bond_sector: {
          oneof: ['bond_sector']
        },
        _fr_type: {
          oneof: ['fr_type']
        },
        _perp_type: {
          oneof: ['perp_type']
        },
        _has_option: {
          oneof: ['has_option']
        },
        _val_yield_exe: {
          oneof: ['val_yield_exe']
        },
        _val_yield_mat: {
          oneof: ['val_yield_mat']
        },
        _val_clean_price_exe: {
          oneof: ['val_clean_price_exe']
        },
        _val_clean_price_mat: {
          oneof: ['val_clean_price_mat']
        },
        _val_full_price_exe: {
          oneof: ['val_full_price_exe']
        },
        _val_modified_duration: {
          oneof: ['val_modified_duration']
        },
        _val_convexity: {
          oneof: ['val_convexity']
        },
        _val_basis_point_value: {
          oneof: ['val_basis_point_value']
        },
        _remaining_par_value: {
          oneof: ['remaining_par_value']
        },
        _csi_yield_to_maturity: {
          oneof: ['csi_yield_to_maturity']
        },
        _csi_modified_duration: {
          oneof: ['csi_modified_duration']
        },
        _csi_clean_price: {
          oneof: ['csi_clean_price']
        },
        _csi_clean_price_exe: {
          oneof: ['csi_clean_price_exe']
        },
        _csi_clean_price_mat: {
          oneof: ['csi_clean_price_mat']
        },
        _csi_yield_exe: {
          oneof: ['csi_yield_exe']
        },
        _csi_yield_mat: {
          oneof: ['csi_yield_mat']
        },
        _csi_full_price_exe: {
          oneof: ['csi_full_price_exe']
        },
        _csi_full_price_mat: {
          oneof: ['csi_full_price_mat']
        },
        _issuer_code: {
          oneof: ['issuer_code']
        },
        _underwriter_code: {
          oneof: ['underwriter_code']
        },
        _maturity_term: {
          oneof: ['maturity_term']
        },
        _term_unit: {
          oneof: ['term_unit']
        },
        _interest_start_date: {
          oneof: ['interest_start_date']
        },
        _maturity_date: {
          oneof: ['maturity_date']
        },
        _maturity_is_holiday: {
          oneof: ['maturity_is_holiday']
        },
        _next_coupon_date: {
          oneof: ['next_coupon_date']
        },
        _auction_date_start: {
          oneof: ['auction_date_start']
        },
        _auction_date_end: {
          oneof: ['auction_date_end']
        },
        _option_type: {
          oneof: ['option_type']
        },
        _option_date: {
          oneof: ['option_date']
        },
        _call_str: {
          oneof: ['call_str']
        },
        _put_str: {
          oneof: ['put_str']
        },
        _compensate_rate: {
          oneof: ['compensate_rate']
        },
        _coupon_type: {
          oneof: ['coupon_type']
        },
        _coupon_rate_spread: {
          oneof: ['coupon_rate_spread']
        },
        _coupon_rate_current: {
          oneof: ['coupon_rate_current']
        },
        _frn_index_id: {
          oneof: ['frn_index_id']
        },
        _fixing_ma_days: {
          oneof: ['fixing_ma_days']
        },
        _issue_rate: {
          oneof: ['issue_rate']
        },
        _issue_amount: {
          oneof: ['issue_amount']
        },
        _redemption_no: {
          oneof: ['redemption_no']
        },
        _sceniority: {
          oneof: ['sceniority']
        },
        _rating_current: {
          oneof: ['rating_current']
        },
        _implied_rating: {
          oneof: ['implied_rating']
        },
        _rating_inst_code: {
          oneof: ['rating_inst_code']
        },
        _rating_date: {
          oneof: ['rating_date']
        },
        _rating_augment: {
          oneof: ['rating_augment']
        },
        _warranter: {
          oneof: ['warranter']
        },
        _issuer_rating: {
          oneof: ['issuer_rating']
        },
        _issuer_rating_inst_code: {
          oneof: ['issuer_rating_inst_code']
        },
        _issue_year: {
          oneof: ['issue_year']
        },
        _asset_status: {
          oneof: ['asset_status']
        },
        _is_cross_mkt: {
          oneof: ['is_cross_mkt']
        },
        _is_mortgage: {
          oneof: ['is_mortgage']
        },
        _mkt_type: {
          oneof: ['mkt_type']
        },
        _is_municipal: {
          oneof: ['is_municipal']
        },
        _issuer_rating_npy: {
          oneof: ['issuer_rating_npy']
        },
        _rating_npy: {
          oneof: ['rating_npy']
        },
        _issuer_outlook: {
          oneof: ['issuer_outlook']
        },
        _ent_cor: {
          oneof: ['ent_cor']
        },
        _time_to_maturity: {
          oneof: ['time_to_maturity']
        },
        _first_maturity_date: {
          oneof: ['first_maturity_date']
        },
        _option_style: {
          oneof: ['option_style']
        },
        _conversion_rate: {
          oneof: ['conversion_rate']
        },
        _fund_objective_sub_category: {
          oneof: ['fund_objective_sub_category']
        },
        _fund_objective_category: {
          oneof: ['fund_objective_category']
        },
        _cbc_rating: {
          oneof: ['cbc_rating']
        },
        _is_gn: {
          oneof: ['is_gn']
        },
        _with_warranty: {
          oneof: ['with_warranty']
        },
        _warrant_method: {
          oneof: ['warrant_method']
        },
        _is_fixed_rate: {
          oneof: ['is_fixed_rate']
        },
        _rating: {
          oneof: ['rating']
        },
        _display_code: {
          oneof: ['display_code']
        }
      },
      fields: {
        ficc_id: {
          type: 'string',
          id: 1
        },
        enable: {
          type: 'EnableEnum',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        sync_version: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        update_time: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        product_class: {
          type: 'ProductClassEnum',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        product_type: {
          type: 'ProductTypeEnum',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        product_key: {
          type: 'string',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        product_code: {
          type: 'string',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        product_name: {
          type: 'string',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        bond_ficc_type: {
          type: 'string',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        key_market: {
          type: 'string',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        code_market: {
          type: 'string',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        bond_code: {
          type: 'string',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        bond_key: {
          type: 'string',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        listed_market: {
          type: 'string',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        listed_date: {
          type: 'string',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        delisted_date: {
          type: 'string',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        full_name: {
          type: 'string',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        short_name: {
          type: 'string',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        pinyin: {
          type: 'string',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        pinyin_full: {
          type: 'string',
          id: 21,
          options: {
            proto3_optional: true
          }
        },
        selective_code: {
          type: 'string',
          id: 22,
          options: {
            proto3_optional: true
          }
        },
        selective_name: {
          type: 'string',
          id: 23,
          options: {
            proto3_optional: true
          }
        },
        ficc_type_code: {
          type: 'string',
          id: 24,
          options: {
            proto3_optional: true
          }
        },
        ficc_belong: {
          type: 'string',
          id: 25,
          options: {
            proto3_optional: true
          }
        },
        bond_category: {
          type: 'BondCategoryEnum',
          id: 26,
          options: {
            proto3_optional: true
          }
        },
        bond_sector: {
          type: 'BondSectorEnum',
          id: 27,
          options: {
            proto3_optional: true
          }
        },
        fr_type: {
          type: 'FRTypeEnum',
          id: 28,
          options: {
            proto3_optional: true
          }
        },
        perp_type: {
          type: 'PerpTypeEnum',
          id: 29,
          options: {
            proto3_optional: true
          }
        },
        has_option: {
          type: 'bool',
          id: 30,
          options: {
            proto3_optional: true
          }
        },
        val_yield_exe: {
          type: 'double',
          id: 31,
          options: {
            proto3_optional: true
          }
        },
        val_yield_mat: {
          type: 'double',
          id: 32,
          options: {
            proto3_optional: true
          }
        },
        val_clean_price_exe: {
          type: 'double',
          id: 33,
          options: {
            proto3_optional: true
          }
        },
        val_clean_price_mat: {
          type: 'double',
          id: 34,
          options: {
            proto3_optional: true
          }
        },
        val_full_price_exe: {
          type: 'double',
          id: 35,
          options: {
            proto3_optional: true
          }
        },
        val_modified_duration: {
          type: 'double',
          id: 36,
          options: {
            proto3_optional: true
          }
        },
        val_convexity: {
          type: 'double',
          id: 37,
          options: {
            proto3_optional: true
          }
        },
        val_basis_point_value: {
          type: 'double',
          id: 38,
          options: {
            proto3_optional: true
          }
        },
        remaining_par_value: {
          type: 'double',
          id: 39,
          options: {
            proto3_optional: true
          }
        },
        csi_yield_to_maturity: {
          type: 'double',
          id: 40,
          options: {
            proto3_optional: true
          }
        },
        csi_modified_duration: {
          type: 'double',
          id: 41,
          options: {
            proto3_optional: true
          }
        },
        csi_clean_price: {
          type: 'double',
          id: 42,
          options: {
            proto3_optional: true
          }
        },
        csi_clean_price_exe: {
          type: 'double',
          id: 43,
          options: {
            proto3_optional: true
          }
        },
        csi_clean_price_mat: {
          type: 'double',
          id: 44,
          options: {
            proto3_optional: true
          }
        },
        csi_yield_exe: {
          type: 'double',
          id: 45,
          options: {
            proto3_optional: true
          }
        },
        csi_yield_mat: {
          type: 'double',
          id: 46,
          options: {
            proto3_optional: true
          }
        },
        csi_full_price_exe: {
          type: 'double',
          id: 47,
          options: {
            proto3_optional: true
          }
        },
        csi_full_price_mat: {
          type: 'double',
          id: 48,
          options: {
            proto3_optional: true
          }
        },
        issuer_code: {
          type: 'string',
          id: 49,
          options: {
            proto3_optional: true
          }
        },
        underwriter_code: {
          type: 'string',
          id: 50,
          options: {
            proto3_optional: true
          }
        },
        maturity_term: {
          type: 'double',
          id: 51,
          options: {
            proto3_optional: true
          }
        },
        term_unit: {
          type: 'string',
          id: 52,
          options: {
            proto3_optional: true
          }
        },
        interest_start_date: {
          type: 'string',
          id: 53,
          options: {
            proto3_optional: true
          }
        },
        maturity_date: {
          type: 'string',
          id: 54,
          options: {
            proto3_optional: true
          }
        },
        maturity_is_holiday: {
          type: 'bool',
          id: 55,
          options: {
            proto3_optional: true
          }
        },
        next_coupon_date: {
          type: 'string',
          id: 56,
          options: {
            proto3_optional: true
          }
        },
        auction_date_start: {
          type: 'string',
          id: 57,
          options: {
            proto3_optional: true
          }
        },
        auction_date_end: {
          type: 'string',
          id: 58,
          options: {
            proto3_optional: true
          }
        },
        option_type: {
          type: 'OptionTypeEnum',
          id: 59,
          options: {
            proto3_optional: true
          }
        },
        option_date: {
          type: 'string',
          id: 60,
          options: {
            proto3_optional: true
          }
        },
        call_str: {
          type: 'string',
          id: 61,
          options: {
            proto3_optional: true
          }
        },
        put_str: {
          type: 'string',
          id: 62,
          options: {
            proto3_optional: true
          }
        },
        compensate_rate: {
          type: 'string',
          id: 63,
          options: {
            proto3_optional: true
          }
        },
        coupon_type: {
          type: 'string',
          id: 64,
          options: {
            proto3_optional: true
          }
        },
        coupon_rate_spread: {
          type: 'double',
          id: 65,
          options: {
            proto3_optional: true
          }
        },
        coupon_rate_current: {
          type: 'double',
          id: 66,
          options: {
            proto3_optional: true
          }
        },
        frn_index_id: {
          type: 'string',
          id: 67,
          options: {
            proto3_optional: true
          }
        },
        fixing_ma_days: {
          type: 'int32',
          id: 68,
          options: {
            proto3_optional: true
          }
        },
        issue_rate: {
          type: 'double',
          id: 69,
          options: {
            proto3_optional: true
          }
        },
        issue_amount: {
          type: 'double',
          id: 70,
          options: {
            proto3_optional: true
          }
        },
        redemption_no: {
          type: 'int32',
          id: 71,
          options: {
            proto3_optional: true
          }
        },
        sceniority: {
          type: 'string',
          id: 72,
          options: {
            proto3_optional: true
          }
        },
        rating_current: {
          type: 'string',
          id: 73,
          options: {
            proto3_optional: true
          }
        },
        implied_rating: {
          type: 'string',
          id: 74,
          options: {
            proto3_optional: true
          }
        },
        rating_inst_code: {
          type: 'string',
          id: 75,
          options: {
            proto3_optional: true
          }
        },
        rating_date: {
          type: 'string',
          id: 76,
          options: {
            proto3_optional: true
          }
        },
        rating_augment: {
          type: 'string',
          id: 77,
          options: {
            proto3_optional: true
          }
        },
        warranter: {
          type: 'string',
          id: 78,
          options: {
            proto3_optional: true
          }
        },
        issuer_rating: {
          type: 'string',
          id: 79,
          options: {
            proto3_optional: true
          }
        },
        issuer_rating_inst_code: {
          type: 'string',
          id: 80,
          options: {
            proto3_optional: true
          }
        },
        issue_year: {
          type: 'int32',
          id: 81,
          options: {
            proto3_optional: true
          }
        },
        asset_status: {
          type: 'string',
          id: 82,
          options: {
            proto3_optional: true
          }
        },
        is_cross_mkt: {
          type: 'bool',
          id: 83,
          options: {
            proto3_optional: true
          }
        },
        is_mortgage: {
          type: 'bool',
          id: 84,
          options: {
            proto3_optional: true
          }
        },
        mkt_type: {
          type: 'MktTypeEnum',
          id: 85,
          options: {
            proto3_optional: true
          }
        },
        is_municipal: {
          type: 'bool',
          id: 86,
          options: {
            proto3_optional: true
          }
        },
        issuer_rating_npy: {
          type: 'string',
          id: 87,
          options: {
            proto3_optional: true
          }
        },
        rating_npy: {
          type: 'string',
          id: 88,
          options: {
            proto3_optional: true
          }
        },
        issuer_outlook: {
          type: 'OutlookEnum',
          id: 89,
          options: {
            proto3_optional: true
          }
        },
        ent_cor: {
          type: 'string',
          id: 90,
          options: {
            proto3_optional: true
          }
        },
        time_to_maturity: {
          type: 'string',
          id: 91,
          options: {
            proto3_optional: true
          }
        },
        first_maturity_date: {
          type: 'string',
          id: 92,
          options: {
            proto3_optional: true
          }
        },
        option_style: {
          type: 'string',
          id: 93,
          options: {
            proto3_optional: true
          }
        },
        conversion_rate: {
          type: 'double',
          id: 94,
          options: {
            proto3_optional: true
          }
        },
        fund_objective_sub_category: {
          type: 'string',
          id: 95,
          options: {
            proto3_optional: true
          }
        },
        fund_objective_category: {
          type: 'string',
          id: 96,
          options: {
            proto3_optional: true
          }
        },
        cbc_rating: {
          type: 'string',
          id: 97,
          options: {
            proto3_optional: true
          }
        },
        is_gn: {
          type: 'bool',
          id: 98,
          options: {
            proto3_optional: true
          }
        },
        with_warranty: {
          type: 'bool',
          id: 99,
          options: {
            proto3_optional: true
          }
        },
        warrant_method: {
          type: 'string',
          id: 100,
          options: {
            proto3_optional: true
          }
        },
        is_fixed_rate: {
          type: 'bool',
          id: 101,
          options: {
            proto3_optional: true
          }
        },
        rating: {
          type: 'string',
          id: 102,
          options: {
            proto3_optional: true
          }
        },
        display_code: {
          type: 'string',
          id: 103,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    BondAppendixSyncStruct: {
      oneofs: {
        _enable: {
          oneof: ['enable']
        },
        _update_time: {
          oneof: ['update_time']
        },
        _sync_version: {
          oneof: ['sync_version']
        },
        _repayment_method: {
          oneof: ['repayment_method']
        },
        _bond_type: {
          oneof: ['bond_type']
        },
        _term_structure: {
          oneof: ['term_structure']
        },
        _conversion_rate: {
          oneof: ['conversion_rate']
        },
        _underwriter_group: {
          oneof: ['underwriter_group']
        }
      },
      fields: {
        ficc_id: {
          type: 'string',
          id: 1
        },
        enable: {
          type: 'EnableEnum',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        update_time: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        sync_version: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        repayment_method: {
          type: 'RepaymentMethodEnum',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        bond_type: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        term_structure: {
          type: 'string',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        conversion_rate: {
          type: 'double',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        underwriter_group: {
          type: 'string',
          id: 9,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    BondDetailSyncStruct: {
      oneofs: {
        _enable: {
          oneof: ['enable']
        },
        _sync_version: {
          oneof: ['sync_version']
        },
        _key_market: {
          oneof: ['key_market']
        },
        _code_market: {
          oneof: ['code_market']
        },
        _bond_code: {
          oneof: ['bond_code']
        },
        _bond_key: {
          oneof: ['bond_key']
        },
        _listed_market: {
          oneof: ['listed_market']
        },
        _listed_date: {
          oneof: ['listed_date']
        },
        _delisted_date: {
          oneof: ['delisted_date']
        },
        _full_name: {
          oneof: ['full_name']
        },
        _short_name: {
          oneof: ['short_name']
        },
        _pinyin: {
          oneof: ['pinyin']
        },
        _pinyin_full: {
          oneof: ['pinyin_full']
        },
        _bond_category: {
          oneof: ['bond_category']
        },
        _fr_type: {
          oneof: ['fr_type']
        },
        _perp_type: {
          oneof: ['perp_type']
        },
        _has_option: {
          oneof: ['has_option']
        },
        _interest_start_date: {
          oneof: ['interest_start_date']
        },
        _maturity_date: {
          oneof: ['maturity_date']
        },
        _maturity_is_holiday: {
          oneof: ['maturity_is_holiday']
        },
        _next_coupon_date: {
          oneof: ['next_coupon_date']
        },
        _option_date: {
          oneof: ['option_date']
        },
        _coupon_rate_current: {
          oneof: ['coupon_rate_current']
        },
        _issue_rate: {
          oneof: ['issue_rate']
        },
        _issue_amount: {
          oneof: ['issue_amount']
        },
        _redemption_no: {
          oneof: ['redemption_no']
        },
        _implied_rating: {
          oneof: ['implied_rating']
        },
        _issuer_rating: {
          oneof: ['issuer_rating']
        },
        _is_cross_mkt: {
          oneof: ['is_cross_mkt']
        },
        _mkt_type: {
          oneof: ['mkt_type']
        },
        _time_to_maturity: {
          oneof: ['time_to_maturity']
        },
        _conversion_rate: {
          oneof: ['conversion_rate']
        },
        _fund_objective_category: {
          oneof: ['fund_objective_category']
        },
        _fund_objective_sub_category: {
          oneof: ['fund_objective_sub_category']
        },
        _rating: {
          oneof: ['rating']
        },
        _issuer_code: {
          oneof: ['issuer_code']
        },
        _display_code: {
          oneof: ['display_code']
        },
        _product_type: {
          oneof: ['product_type']
        },
        _option_type: {
          oneof: ['option_type']
        },
        _with_warranty: {
          oneof: ['with_warranty']
        },
        _is_fixed_rate: {
          oneof: ['is_fixed_rate']
        },
        _val_yield_exercise: {
          oneof: ['val_yield_exercise']
        },
        _val_yield_maturity: {
          oneof: ['val_yield_maturity']
        },
        _val_clean_price_exercise: {
          oneof: ['val_clean_price_exercise']
        },
        _val_clean_price_maturity: {
          oneof: ['val_clean_price_maturity']
        },
        _val_modified_duration: {
          oneof: ['val_modified_duration']
        },
        _val_convexity: {
          oneof: ['val_convexity']
        },
        _val_basis_point_value: {
          oneof: ['val_basis_point_value']
        },
        _csi_yield_exercise: {
          oneof: ['csi_yield_exercise']
        },
        _csi_yield_maturity: {
          oneof: ['csi_yield_maturity']
        },
        _csi_clean_price_exercise: {
          oneof: ['csi_clean_price_exercise']
        },
        _csi_clean_price_maturity: {
          oneof: ['csi_clean_price_maturity']
        },
        _csi_full_price_exercise: {
          oneof: ['csi_full_price_exercise']
        },
        _csi_full_price_maturity: {
          oneof: ['csi_full_price_maturity']
        },
        _repayment_method: {
          oneof: ['repayment_method']
        },
        _first_maturity_date: {
          oneof: ['first_maturity_date']
        },
        _call_str: {
          oneof: ['call_str']
        },
        _put_str: {
          oneof: ['put_str']
        },
        _ent_cor: {
          oneof: ['ent_cor']
        }
      },
      fields: {
        ficc_id: {
          type: 'string',
          id: 1
        },
        enable: {
          type: 'EnableEnum',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        sync_version: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        key_market: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        code_market: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        bond_code: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        bond_key: {
          type: 'string',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        listed_market: {
          type: 'string',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        listed_date: {
          type: 'string',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        delisted_date: {
          type: 'string',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        full_name: {
          type: 'string',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        short_name: {
          type: 'string',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        pinyin: {
          type: 'string',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        pinyin_full: {
          type: 'string',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        bond_category: {
          type: 'BondCategoryEnum',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        fr_type: {
          type: 'FRTypeEnum',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        perp_type: {
          type: 'PerpTypeEnum',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        has_option: {
          type: 'bool',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        interest_start_date: {
          type: 'string',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        maturity_date: {
          type: 'string',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        maturity_is_holiday: {
          type: 'bool',
          id: 21,
          options: {
            proto3_optional: true
          }
        },
        next_coupon_date: {
          type: 'string',
          id: 22,
          options: {
            proto3_optional: true
          }
        },
        option_date: {
          type: 'string',
          id: 23,
          options: {
            proto3_optional: true
          }
        },
        coupon_rate_current: {
          type: 'double',
          id: 24,
          options: {
            proto3_optional: true
          }
        },
        issue_rate: {
          type: 'double',
          id: 25,
          options: {
            proto3_optional: true
          }
        },
        issue_amount: {
          type: 'double',
          id: 26,
          options: {
            proto3_optional: true
          }
        },
        redemption_no: {
          type: 'int32',
          id: 27,
          options: {
            proto3_optional: true
          }
        },
        implied_rating: {
          type: 'string',
          id: 28,
          options: {
            proto3_optional: true
          }
        },
        issuer_rating: {
          type: 'string',
          id: 29,
          options: {
            proto3_optional: true
          }
        },
        is_cross_mkt: {
          type: 'bool',
          id: 30,
          options: {
            proto3_optional: true
          }
        },
        mkt_type: {
          type: 'MktTypeEnum',
          id: 31,
          options: {
            proto3_optional: true
          }
        },
        time_to_maturity: {
          type: 'string',
          id: 32,
          options: {
            proto3_optional: true
          }
        },
        conversion_rate: {
          type: 'double',
          id: 33,
          options: {
            proto3_optional: true
          }
        },
        fund_objective_category: {
          type: 'string',
          id: 34,
          options: {
            proto3_optional: true
          }
        },
        fund_objective_sub_category: {
          type: 'string',
          id: 35,
          options: {
            proto3_optional: true
          }
        },
        rating: {
          type: 'string',
          id: 36,
          options: {
            proto3_optional: true
          }
        },
        issuer_code: {
          type: 'string',
          id: 37,
          options: {
            proto3_optional: true
          }
        },
        display_code: {
          type: 'string',
          id: 38,
          options: {
            proto3_optional: true
          }
        },
        product_type: {
          type: 'ProductTypeEnum',
          id: 39,
          options: {
            proto3_optional: true
          }
        },
        option_type: {
          type: 'OptionTypeEnum',
          id: 40,
          options: {
            proto3_optional: true
          }
        },
        with_warranty: {
          type: 'bool',
          id: 41,
          options: {
            proto3_optional: true
          }
        },
        is_fixed_rate: {
          type: 'bool',
          id: 42,
          options: {
            proto3_optional: true
          }
        },
        val_yield_exercise: {
          type: 'double',
          id: 43,
          options: {
            proto3_optional: true
          }
        },
        val_yield_maturity: {
          type: 'double',
          id: 44,
          options: {
            proto3_optional: true
          }
        },
        val_clean_price_exercise: {
          type: 'double',
          id: 45,
          options: {
            proto3_optional: true
          }
        },
        val_clean_price_maturity: {
          type: 'double',
          id: 46,
          options: {
            proto3_optional: true
          }
        },
        val_modified_duration: {
          type: 'double',
          id: 47,
          options: {
            proto3_optional: true
          }
        },
        val_convexity: {
          type: 'double',
          id: 48,
          options: {
            proto3_optional: true
          }
        },
        val_basis_point_value: {
          type: 'double',
          id: 49,
          options: {
            proto3_optional: true
          }
        },
        csi_yield_exercise: {
          type: 'double',
          id: 50,
          options: {
            proto3_optional: true
          }
        },
        csi_yield_maturity: {
          type: 'double',
          id: 51,
          options: {
            proto3_optional: true
          }
        },
        csi_clean_price_exercise: {
          type: 'double',
          id: 52,
          options: {
            proto3_optional: true
          }
        },
        csi_clean_price_maturity: {
          type: 'double',
          id: 53,
          options: {
            proto3_optional: true
          }
        },
        csi_full_price_exercise: {
          type: 'double',
          id: 54,
          options: {
            proto3_optional: true
          }
        },
        csi_full_price_maturity: {
          type: 'double',
          id: 55,
          options: {
            proto3_optional: true
          }
        },
        repayment_method: {
          type: 'RepaymentMethodEnum',
          id: 56,
          options: {
            proto3_optional: true
          }
        },
        first_maturity_date: {
          type: 'string',
          id: 59,
          options: {
            proto3_optional: true
          }
        },
        call_str: {
          type: 'string',
          id: 60,
          options: {
            proto3_optional: true
          }
        },
        put_str: {
          type: 'string',
          id: 61,
          options: {
            proto3_optional: true
          }
        },
        ent_cor: {
          type: 'string',
          id: 62,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    HolidaySyncStruct: {
      oneofs: {
        _enable: {
          oneof: ['enable']
        },
        _update_time: {
          oneof: ['update_time']
        },
        _sync_version: {
          oneof: ['sync_version']
        },
        _holiday_date: {
          oneof: ['holiday_date']
        },
        _country: {
          oneof: ['country']
        },
        _market_type: {
          oneof: ['market_type']
        },
        _holiday_name: {
          oneof: ['holiday_name']
        }
      },
      fields: {
        holiday_id: {
          type: 'string',
          id: 1
        },
        enable: {
          type: 'EnableEnum',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        update_time: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        sync_version: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        holiday_date: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        country: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        market_type: {
          type: 'string',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        holiday_name: {
          type: 'string',
          id: 8,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    QuoteDraftDetailOrderStruct: {
      oneofs: {
        _with_trader_info: {
          oneof: ['with_trader_info']
        }
      },
      fields: {
        corresponding_line: {
          type: 'int32',
          id: 1
        },
        detail_id_list: {
          rule: 'repeated',
          type: 'string',
          id: 2
        },
        with_trader_info: {
          type: 'bool',
          id: 3,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    QuoteDraftMessageSyncStruct: {
      oneofs: {
        _create_time: {
          oneof: ['create_time']
        },
        _update_time: {
          oneof: ['update_time']
        },
        _inst_id: {
          oneof: ['inst_id']
        },
        _trader_id: {
          oneof: ['trader_id']
        },
        _broker_id: {
          oneof: ['broker_id']
        },
        _img_url: {
          oneof: ['img_url']
        },
        _creator: {
          oneof: ['creator']
        },
        _operator: {
          oneof: ['operator']
        },
        _trader_tag: {
          oneof: ['trader_tag']
        },
        _sync_version: {
          oneof: ['sync_version']
        },
        _enable: {
          oneof: ['enable']
        },
        _product_type: {
          oneof: ['product_type']
        },
        _modified_status: {
          oneof: ['modified_status']
        },
        _source: {
          oneof: ['source']
        },
        _status: {
          oneof: ['status']
        },
        _img_name: {
          oneof: ['img_name']
        }
      },
      fields: {
        message_id: {
          type: 'string',
          id: 1
        },
        create_time: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        update_time: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        inst_id: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        trader_id: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        broker_id: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        text_list: {
          rule: 'repeated',
          type: 'string',
          id: 7
        },
        img_url: {
          type: 'string',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        creator: {
          type: 'string',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        operator: {
          type: 'string',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        trader_tag: {
          type: 'string',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        sync_version: {
          type: 'string',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        enable: {
          type: 'EnableEnum',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        product_type: {
          type: 'ProductTypeEnum',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        detail_order_list: {
          rule: 'repeated',
          type: 'QuoteDraftDetailOrderStruct',
          id: 15
        },
        modified_status: {
          type: 'QuoteDraftModifiedStatusEnum',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        source: {
          type: 'OperationSourceEnum',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        status: {
          type: 'QuoteDraftMessageStatusEnum',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        img_name: {
          type: 'string',
          id: 19,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    QuoteDraftDetailSyncStruct: {
      oneofs: {
        _message_id: {
          oneof: ['message_id']
        },
        _corresponding_line: {
          oneof: ['corresponding_line']
        },
        _side: {
          oneof: ['side']
        },
        _key_market: {
          oneof: ['key_market']
        },
        _quote_type: {
          oneof: ['quote_type']
        },
        _price: {
          oneof: ['price']
        },
        _volume: {
          oneof: ['volume']
        },
        _return_point: {
          oneof: ['return_point']
        },
        _flag_rebate: {
          oneof: ['flag_rebate']
        },
        _flag_star: {
          oneof: ['flag_star']
        },
        _flag_package: {
          oneof: ['flag_package']
        },
        _flag_oco: {
          oneof: ['flag_oco']
        },
        _flag_exchange: {
          oneof: ['flag_exchange']
        },
        _flag_intention: {
          oneof: ['flag_intention']
        },
        _flag_indivisible: {
          oneof: ['flag_indivisible']
        },
        _flag_stock_exchange: {
          oneof: ['flag_stock_exchange']
        },
        _flag_bilateral: {
          oneof: ['flag_bilateral']
        },
        _flag_request: {
          oneof: ['flag_request']
        },
        _flag_urgent: {
          oneof: ['flag_urgent']
        },
        _flag_internal: {
          oneof: ['flag_internal']
        },
        _flag_recommend: {
          oneof: ['flag_recommend']
        },
        _comment: {
          oneof: ['comment']
        },
        _is_exercise: {
          oneof: ['is_exercise']
        },
        _exercise_manual: {
          oneof: ['exercise_manual']
        },
        _status: {
          oneof: ['status']
        },
        _creator: {
          oneof: ['creator']
        },
        _operator: {
          oneof: ['operator']
        },
        _sync_version: {
          oneof: ['sync_version']
        },
        _enable: {
          oneof: ['enable']
        },
        _create_time: {
          oneof: ['create_time']
        },
        _update_time: {
          oneof: ['update_time']
        },
        _product_type: {
          oneof: ['product_type']
        },
        _flag_inverted: {
          oneof: ['flag_inverted']
        }
      },
      fields: {
        detail_id: {
          type: 'string',
          id: 1
        },
        message_id: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        corresponding_line: {
          type: 'int32',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        side: {
          type: 'SideEnum',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        key_market: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        quote_type: {
          type: 'BondQuoteTypeEnum',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        price: {
          type: 'double',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        volume: {
          type: 'double',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        return_point: {
          type: 'double',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        flag_rebate: {
          type: 'bool',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        flag_star: {
          type: 'int32',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        flag_package: {
          type: 'bool',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        flag_oco: {
          type: 'bool',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        flag_exchange: {
          type: 'bool',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        flag_intention: {
          type: 'bool',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        flag_indivisible: {
          type: 'bool',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        flag_stock_exchange: {
          type: 'bool',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        flag_bilateral: {
          type: 'bool',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        flag_request: {
          type: 'bool',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        flag_urgent: {
          type: 'bool',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        flag_internal: {
          type: 'bool',
          id: 21,
          options: {
            proto3_optional: true
          }
        },
        flag_recommend: {
          type: 'bool',
          id: 22,
          options: {
            proto3_optional: true
          }
        },
        liquidation_speed_list: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 23
        },
        comment: {
          type: 'string',
          id: 24,
          options: {
            proto3_optional: true
          }
        },
        is_exercise: {
          type: 'bool',
          id: 25,
          options: {
            proto3_optional: true
          }
        },
        exercise_manual: {
          type: 'bool',
          id: 26,
          options: {
            proto3_optional: true
          }
        },
        status: {
          type: 'QuoteDraftDetailStatusEnum',
          id: 27,
          options: {
            proto3_optional: true
          }
        },
        creator: {
          type: 'string',
          id: 28,
          options: {
            proto3_optional: true
          }
        },
        operator: {
          type: 'string',
          id: 29,
          options: {
            proto3_optional: true
          }
        },
        sync_version: {
          type: 'string',
          id: 30,
          options: {
            proto3_optional: true
          }
        },
        enable: {
          type: 'EnableEnum',
          id: 31,
          options: {
            proto3_optional: true
          }
        },
        create_time: {
          type: 'string',
          id: 32,
          options: {
            proto3_optional: true
          }
        },
        update_time: {
          type: 'string',
          id: 33,
          options: {
            proto3_optional: true
          }
        },
        product_type: {
          type: 'ProductTypeEnum',
          id: 34,
          options: {
            proto3_optional: true
          }
        },
        flag_inverted: {
          type: 'bool',
          id: 35,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    DealInfoSyncStruct: {
      oneofs: {
        _internal_code: {
          oneof: ['internal_code']
        },
        _create_time: {
          oneof: ['create_time']
        },
        _update_time: {
          oneof: ['update_time']
        },
        _deal_type: {
          oneof: ['deal_type']
        },
        _source: {
          oneof: ['source']
        },
        _flag_bridge: {
          oneof: ['flag_bridge']
        },
        _send_order_msg: {
          oneof: ['send_order_msg']
        },
        _bid_send_order_msg: {
          oneof: ['bid_send_order_msg']
        },
        _ofr_send_order_msg: {
          oneof: ['ofr_send_order_msg']
        },
        _bond_key_market: {
          oneof: ['bond_key_market']
        },
        _confirm_volume: {
          oneof: ['confirm_volume']
        },
        _price_type: {
          oneof: ['price_type']
        },
        _price: {
          oneof: ['price']
        },
        _yield: {
          oneof: ['yield']
        },
        _clean_price: {
          oneof: ['clean_price']
        },
        _full_price: {
          oneof: ['full_price']
        },
        _return_point: {
          oneof: ['return_point']
        },
        _bid_settlement_type: {
          oneof: ['bid_settlement_type']
        },
        _bid_traded_date: {
          oneof: ['bid_traded_date']
        },
        _bid_delivery_date: {
          oneof: ['bid_delivery_date']
        },
        _ofr_settlement_type: {
          oneof: ['ofr_settlement_type']
        },
        _ofr_traded_date: {
          oneof: ['ofr_traded_date']
        },
        _ofr_delivery_date: {
          oneof: ['ofr_delivery_date']
        },
        _flag_stock_exchange: {
          oneof: ['flag_stock_exchange']
        },
        _exercise_type: {
          oneof: ['exercise_type']
        },
        _deal_status: {
          oneof: ['deal_status']
        },
        _bid_inst_id: {
          oneof: ['bid_inst_id']
        },
        _bid_trader_id: {
          oneof: ['bid_trader_id']
        },
        _bid_broker_id: {
          oneof: ['bid_broker_id']
        },
        _flag_bid_modify_brokerage: {
          oneof: ['flag_bid_modify_brokerage']
        },
        _bid_confirm_status: {
          oneof: ['bid_confirm_status']
        },
        _ofr_inst_id: {
          oneof: ['ofr_inst_id']
        },
        _ofr_trader_id: {
          oneof: ['ofr_trader_id']
        },
        _ofr_broker_id: {
          oneof: ['ofr_broker_id']
        },
        _flag_ofr_modify_brokerage: {
          oneof: ['flag_ofr_modify_brokerage']
        },
        _ofr_confirm_status: {
          oneof: ['ofr_confirm_status']
        },
        _spot_pricing_record_id: {
          oneof: ['spot_pricing_record_id']
        },
        _flag_internal: {
          oneof: ['flag_internal']
        },
        _operator: {
          oneof: ['operator']
        },
        _listed_market: {
          oneof: ['listed_market']
        },
        _bid_bridge_record_id: {
          oneof: ['bid_bridge_record_id']
        },
        _ofr_bridge_record_id: {
          oneof: ['ofr_bridge_record_id']
        },
        _im_msg_text: {
          oneof: ['im_msg_text']
        },
        _im_msg_send_status: {
          oneof: ['im_msg_send_status']
        },
        _im_msg_record_id: {
          oneof: ['im_msg_record_id']
        },
        _quote_id: {
          oneof: ['quote_id']
        },
        _spot_pricing_volume: {
          oneof: ['spot_pricing_volume']
        },
        _bid_old_content: {
          oneof: ['bid_old_content']
        },
        _ofr_old_content: {
          oneof: ['ofr_old_content']
        },
        _bid_deal_read_status: {
          oneof: ['bid_deal_read_status']
        },
        _ofr_deal_read_status: {
          oneof: ['ofr_deal_read_status']
        },
        _exercise_manual: {
          oneof: ['exercise_manual']
        },
        _flag_bid_bridge_hide_comment: {
          oneof: ['flag_bid_bridge_hide_comment']
        },
        _flag_ofr_bridge_hide_comment: {
          oneof: ['flag_ofr_bridge_hide_comment']
        },
        _bid_bridge_send_order_comment: {
          oneof: ['bid_bridge_send_order_comment']
        },
        _ofr_bridge_send_order_comment: {
          oneof: ['ofr_bridge_send_order_comment']
        },
        _enable: {
          oneof: ['enable']
        },
        _sync_version: {
          oneof: ['sync_version']
        },
        _bid_modify_brokerage_reason: {
          oneof: ['bid_modify_brokerage_reason']
        },
        _ofr_modify_brokerage_reason: {
          oneof: ['ofr_modify_brokerage_reason']
        },
        _hand_over_status: {
          oneof: ['hand_over_status']
        },
        _bid_brokerage_comment: {
          oneof: ['bid_brokerage_comment']
        },
        _ofr_brokerage_comment: {
          oneof: ['ofr_brokerage_comment']
        },
        _bid_trader_tag: {
          oneof: ['bid_trader_tag']
        },
        _ofr_trader_tag: {
          oneof: ['ofr_trader_tag']
        },
        _bid_broker_id_b: {
          oneof: ['bid_broker_id_b']
        },
        _bid_broker_id_c: {
          oneof: ['bid_broker_id_c']
        },
        _bid_broker_id_d: {
          oneof: ['bid_broker_id_d']
        },
        _ofr_broker_id_b: {
          oneof: ['ofr_broker_id_b']
        },
        _ofr_broker_id_c: {
          oneof: ['ofr_broker_id_c']
        },
        _ofr_broker_id_d: {
          oneof: ['ofr_broker_id_d']
        },
        _flag_reverse_sync: {
          oneof: ['flag_reverse_sync']
        },
        _bid_add_bridge_operator_id: {
          oneof: ['bid_add_bridge_operator_id']
        },
        _ofr_add_bridge_operator_id: {
          oneof: ['ofr_add_bridge_operator_id']
        },
        _remain_volume: {
          oneof: ['remain_volume']
        },
        _flag_bid_pay_for_inst: {
          oneof: ['flag_bid_pay_for_inst']
        },
        _flag_ofr_pay_for_inst: {
          oneof: ['flag_ofr_pay_for_inst']
        },
        _product_type: {
          oneof: ['product_type']
        },
        _confirm_time: {
          oneof: ['confirm_time']
        }
      },
      fields: {
        deal_id: {
          type: 'string',
          id: 1
        },
        internal_code: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        create_time: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        update_time: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        deal_type: {
          type: 'DealTypeEnum',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        source: {
          type: 'OperationSourceEnum',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        flag_bridge: {
          type: 'bool',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        send_order_msg: {
          type: 'string',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        bid_send_order_msg: {
          type: 'string',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        ofr_send_order_msg: {
          type: 'string',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        bond_key_market: {
          type: 'string',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        confirm_volume: {
          type: 'double',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        price_type: {
          type: 'BondQuoteTypeEnum',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        price: {
          type: 'double',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        yield: {
          type: 'double',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        clean_price: {
          type: 'double',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        full_price: {
          type: 'double',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        return_point: {
          type: 'double',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        bid_settlement_type: {
          type: 'LiquidationSpeedStruct',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        bid_traded_date: {
          type: 'string',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        bid_delivery_date: {
          type: 'string',
          id: 21,
          options: {
            proto3_optional: true
          }
        },
        ofr_settlement_type: {
          type: 'LiquidationSpeedStruct',
          id: 22,
          options: {
            proto3_optional: true
          }
        },
        ofr_traded_date: {
          type: 'string',
          id: 23,
          options: {
            proto3_optional: true
          }
        },
        ofr_delivery_date: {
          type: 'string',
          id: 24,
          options: {
            proto3_optional: true
          }
        },
        flag_stock_exchange: {
          type: 'bool',
          id: 25,
          options: {
            proto3_optional: true
          }
        },
        exercise_type: {
          type: 'ExerciseTypeEnum',
          id: 26,
          options: {
            proto3_optional: true
          }
        },
        deal_status: {
          type: 'BondDealStatusEnum',
          id: 27,
          options: {
            proto3_optional: true
          }
        },
        bid_inst_id: {
          type: 'string',
          id: 28,
          options: {
            proto3_optional: true
          }
        },
        bid_trader_id: {
          type: 'string',
          id: 29,
          options: {
            proto3_optional: true
          }
        },
        bid_broker_id: {
          type: 'string',
          id: 30,
          options: {
            proto3_optional: true
          }
        },
        flag_bid_modify_brokerage: {
          type: 'bool',
          id: 31,
          options: {
            proto3_optional: true
          }
        },
        bid_confirm_status: {
          type: 'SpotPricingConfirmStatusEnum',
          id: 32,
          options: {
            proto3_optional: true
          }
        },
        ofr_inst_id: {
          type: 'string',
          id: 33,
          options: {
            proto3_optional: true
          }
        },
        ofr_trader_id: {
          type: 'string',
          id: 34,
          options: {
            proto3_optional: true
          }
        },
        ofr_broker_id: {
          type: 'string',
          id: 35,
          options: {
            proto3_optional: true
          }
        },
        flag_ofr_modify_brokerage: {
          type: 'bool',
          id: 36,
          options: {
            proto3_optional: true
          }
        },
        ofr_confirm_status: {
          type: 'SpotPricingConfirmStatusEnum',
          id: 37,
          options: {
            proto3_optional: true
          }
        },
        spot_pricing_record_id: {
          type: 'string',
          id: 38,
          options: {
            proto3_optional: true
          }
        },
        flag_internal: {
          type: 'bool',
          id: 39,
          options: {
            proto3_optional: true
          }
        },
        operator: {
          type: 'string',
          id: 40,
          options: {
            proto3_optional: true
          }
        },
        listed_market: {
          type: 'string',
          id: 41,
          options: {
            proto3_optional: true
          }
        },
        bid_bridge_record_id: {
          type: 'string',
          id: 42,
          options: {
            proto3_optional: true
          }
        },
        ofr_bridge_record_id: {
          type: 'string',
          id: 43,
          options: {
            proto3_optional: true
          }
        },
        im_msg_text: {
          type: 'string',
          id: 44,
          options: {
            proto3_optional: true
          }
        },
        im_msg_send_status: {
          type: 'ImMsgSendStatusEnum',
          id: 45,
          options: {
            proto3_optional: true
          }
        },
        im_msg_record_id: {
          type: 'string',
          id: 46,
          options: {
            proto3_optional: true
          }
        },
        quote_id: {
          type: 'string',
          id: 47,
          options: {
            proto3_optional: true
          }
        },
        spot_pricing_volume: {
          type: 'double',
          id: 48,
          options: {
            proto3_optional: true
          }
        },
        bid_old_content: {
          type: 'OldContentSyncStruct',
          id: 49,
          options: {
            proto3_optional: true
          }
        },
        ofr_old_content: {
          type: 'OldContentSyncStruct',
          id: 50,
          options: {
            proto3_optional: true
          }
        },
        bid_deal_read_status: {
          type: 'DealReadStatusEnum',
          id: 51,
          options: {
            proto3_optional: true
          }
        },
        ofr_deal_read_status: {
          type: 'DealReadStatusEnum',
          id: 52,
          options: {
            proto3_optional: true
          }
        },
        exercise_manual: {
          type: 'bool',
          id: 53,
          options: {
            proto3_optional: true
          }
        },
        flag_bid_bridge_hide_comment: {
          type: 'bool',
          id: 54,
          options: {
            proto3_optional: true
          }
        },
        flag_ofr_bridge_hide_comment: {
          type: 'bool',
          id: 55,
          options: {
            proto3_optional: true
          }
        },
        bid_bridge_send_order_comment: {
          type: 'string',
          id: 56,
          options: {
            proto3_optional: true
          }
        },
        ofr_bridge_send_order_comment: {
          type: 'string',
          id: 57,
          options: {
            proto3_optional: true
          }
        },
        enable: {
          type: 'EnableEnum',
          id: 58,
          options: {
            proto3_optional: true
          }
        },
        sync_version: {
          type: 'string',
          id: 59,
          options: {
            proto3_optional: true
          }
        },
        bid_modify_brokerage_reason: {
          type: 'string',
          id: 60,
          options: {
            proto3_optional: true
          }
        },
        ofr_modify_brokerage_reason: {
          type: 'string',
          id: 61,
          options: {
            proto3_optional: true
          }
        },
        hand_over_status: {
          type: 'DealHandOverStatusEnum',
          id: 62,
          options: {
            proto3_optional: true
          }
        },
        bid_brokerage_comment: {
          type: 'ReceiptDealTradeInstBrokerageCommentEnum',
          id: 63,
          options: {
            proto3_optional: true
          }
        },
        ofr_brokerage_comment: {
          type: 'ReceiptDealTradeInstBrokerageCommentEnum',
          id: 64,
          options: {
            proto3_optional: true
          }
        },
        bid_trader_tag: {
          type: 'string',
          id: 65,
          options: {
            proto3_optional: true
          }
        },
        ofr_trader_tag: {
          type: 'string',
          id: 66,
          options: {
            proto3_optional: true
          }
        },
        bid_broker_id_b: {
          type: 'string',
          id: 67,
          options: {
            proto3_optional: true
          }
        },
        bid_broker_id_c: {
          type: 'string',
          id: 68,
          options: {
            proto3_optional: true
          }
        },
        bid_broker_id_d: {
          type: 'string',
          id: 69,
          options: {
            proto3_optional: true
          }
        },
        ofr_broker_id_b: {
          type: 'string',
          id: 70,
          options: {
            proto3_optional: true
          }
        },
        ofr_broker_id_c: {
          type: 'string',
          id: 71,
          options: {
            proto3_optional: true
          }
        },
        ofr_broker_id_d: {
          type: 'string',
          id: 72,
          options: {
            proto3_optional: true
          }
        },
        flag_reverse_sync: {
          type: 'bool',
          id: 73,
          options: {
            proto3_optional: true
          }
        },
        flag_unrefer_quote: {
          type: 'bool',
          id: 74
        },
        bid_add_bridge_operator_id: {
          type: 'string',
          id: 75,
          options: {
            proto3_optional: true
          }
        },
        ofr_add_bridge_operator_id: {
          type: 'string',
          id: 76,
          options: {
            proto3_optional: true
          }
        },
        remain_volume: {
          type: 'double',
          id: 77,
          options: {
            proto3_optional: true
          }
        },
        flag_deal_has_changed: {
          type: 'bool',
          id: 78
        },
        bridge_list: {
          rule: 'repeated',
          type: 'ReceiptDealBridgeOpStruct',
          id: 79
        },
        flag_bid_pay_for_inst: {
          type: 'bool',
          id: 80,
          options: {
            proto3_optional: true
          }
        },
        flag_ofr_pay_for_inst: {
          type: 'bool',
          id: 81,
          options: {
            proto3_optional: true
          }
        },
        product_type: {
          type: 'ProductTypeEnum',
          id: 82,
          options: {
            proto3_optional: true
          }
        },
        confirm_time: {
          type: 'string',
          id: 83,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    InitSyncMessage: {
      fields: {
        message_id: {
          type: 'string',
          id: 1
        },
        message_type: {
          type: 'DataSyncMessageTypeEnum',
          id: 2
        },
        quote_list: {
          rule: 'repeated',
          type: 'BondQuoteSyncStruct',
          id: 3
        },
        trader_list: {
          rule: 'repeated',
          type: 'TraderSyncStruct',
          id: 4
        },
        inst_list: {
          rule: 'repeated',
          type: 'InstSyncStruct',
          id: 5
        },
        user_list: {
          rule: 'repeated',
          type: 'UserSyncStruct',
          id: 6
        },
        sync_data_type: {
          type: 'SyncDataTypeEnum',
          id: 7
        },
        bond_basic_list: {
          rule: 'repeated',
          type: 'BondBasicSyncStruct',
          id: 8
        }
      }
    },
    InitSyncTaskMessage: {
      fields: {
        uid: {
          type: 'int64',
          id: 1
        },
        channel: {
          type: 'string',
          id: 2
        },
        data_type: {
          type: 'SyncDataTypeEnum',
          id: 3
        },
        start_version: {
          type: 'int64',
          id: 4
        },
        end_version: {
          type: 'int64',
          id: 5
        }
      }
    },
    RealtimeSyncMessage: {
      fields: {
        upsert_quote_list: {
          rule: 'repeated',
          type: 'BondQuoteSyncStruct',
          id: 1
        },
        removed_quote_id_list: {
          rule: 'repeated',
          type: 'string',
          id: 2
        }
      }
    },
    BondQuoteSyncCheckStruct: {
      fields: {
        quote_id: {
          type: 'string',
          id: 1
        },
        sync_version: {
          type: 'string',
          id: 2
        },
        refer_type: {
          type: 'RefTypeEnum',
          id: 3
        },
        enable: {
          type: 'EnableEnum',
          id: 4
        }
      }
    },
    CheckSyncMessage: {
      fields: {
        quote_list: {
          rule: 'repeated',
          type: 'BondQuoteSyncCheckStruct',
          id: 1
        },
        start_time: {
          type: 'string',
          id: 2
        },
        end_time: {
          type: 'string',
          id: 3
        }
      }
    },
    QuoteParsingStruct: {
      oneofs: {
        _algo_tags: {
          oneof: ['algo_tags']
        },
        _yield: {
          oneof: ['yield']
        },
        _clean_price: {
          oneof: ['clean_price']
        },
        _full_price: {
          oneof: ['full_price']
        },
        _volume: {
          oneof: ['volume']
        },
        _traded_date: {
          oneof: ['traded_date']
        },
        _settlement_date: {
          oneof: ['settlement_date']
        },
        _delivery_date: {
          oneof: ['delivery_date']
        },
        _comment: {
          oneof: ['comment']
        },
        _return_point: {
          oneof: ['return_point']
        },
        _spread: {
          oneof: ['spread']
        },
        _flag_internal: {
          oneof: ['flag_internal']
        },
        _flag_urgent: {
          oneof: ['flag_urgent']
        },
        _flag_exchange: {
          oneof: ['flag_exchange']
        },
        _flag_star: {
          oneof: ['flag_star']
        },
        _flag_oco: {
          oneof: ['flag_oco']
        },
        _flag_package: {
          oneof: ['flag_package']
        },
        _flag_recommend: {
          oneof: ['flag_recommend']
        },
        _is_exercise: {
          oneof: ['is_exercise']
        },
        _flag_rebate: {
          oneof: ['flag_rebate']
        },
        _flag_intention: {
          oneof: ['flag_intention']
        },
        _corresponding_line: {
          oneof: ['corresponding_line']
        }
      },
      fields: {
        bond_info: {
          type: 'BondLiteStruct',
          id: 1,
          options: {
            deprecated: true
          }
        },
        trader_list: {
          rule: 'repeated',
          type: 'TraderStruct',
          id: 2,
          options: {
            deprecated: true
          }
        },
        algo_tags: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        side: {
          type: 'int32',
          id: 4
        },
        yield: {
          type: 'double',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        clean_price: {
          type: 'double',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        full_price: {
          type: 'double',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        volume: {
          type: 'double',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        traded_date: {
          type: 'string',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        settlement_date: {
          type: 'string',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        delivery_date: {
          type: 'string',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        comment: {
          type: 'string',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        return_point: {
          type: 'double',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        spread: {
          type: 'double',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        flag_internal: {
          type: 'bool',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        flag_urgent: {
          type: 'bool',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        flag_exchange: {
          type: 'bool',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        flag_star: {
          type: 'int32',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        flag_oco: {
          type: 'bool',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        flag_package: {
          type: 'bool',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        flag_recommend: {
          type: 'bool',
          id: 21,
          options: {
            proto3_optional: true
          }
        },
        is_exercise: {
          type: 'bool',
          id: 22,
          options: {
            proto3_optional: true
          }
        },
        flag_rebate: {
          type: 'bool',
          id: 23,
          options: {
            proto3_optional: true
          }
        },
        quote_type: {
          type: 'BondQuoteTypeEnum',
          id: 24
        },
        flag_intention: {
          type: 'bool',
          id: 25,
          options: {
            proto3_optional: true
          }
        },
        liquidation_speed_list: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 26
        },
        corresponding_line: {
          type: 'int32',
          id: 27,
          options: {
            proto3_optional: true
          }
        },
        bond_basic_info: {
          type: 'FiccBondBasicStruct',
          id: 28
        }
      }
    },
    BridgeInstStruct: {
      fields: {
        bridge_inst_id: {
          type: 'string',
          id: 1
        },
        contact_info: {
          type: 'DealInstTraderStruct',
          id: 2
        },
        biller_info: {
          type: 'DealInstTraderStruct',
          id: 3
        },
        send_msg: {
          type: 'string',
          id: 4
        },
        channel: {
          type: 'BridgeChannelEnum',
          id: 5
        },
        comment: {
          type: 'string',
          id: 6
        },
        contact: {
          type: 'string',
          id: 7
        },
        bridge_status: {
          type: 'int32',
          id: 8,
          options: {
            deprecated: true
          }
        },
        create_time: {
          type: 'string',
          id: 9
        },
        update_time: {
          type: 'string',
          id: 10
        }
      }
    },
    DealInstTraderStruct: {
      oneofs: {
        _inst_full_name: {
          oneof: ['inst_full_name']
        },
        _inst_short_name_zh: {
          oneof: ['inst_short_name_zh']
        },
        _inst_full_name_zh: {
          oneof: ['inst_full_name_zh']
        },
        _trader_name_zh: {
          oneof: ['trader_name_zh']
        },
        _trader_tag: {
          oneof: ['trader_tag']
        }
      },
      fields: {
        inst_id: {
          type: 'string',
          id: 1
        },
        inst_full_name: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        inst_short_name_zh: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        inst_full_name_zh: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        trader_id: {
          type: 'string',
          id: 5
        },
        trader_name_zh: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        trader_tag: {
          type: 'string',
          id: 7,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    BridgeRecordStruct: {
      oneofs: {
        _flag_double_bridge: {
          oneof: ['flag_double_bridge']
        }
      },
      fields: {
        bridge_record_id: {
          type: 'string',
          id: 1
        },
        contract_id: {
          type: 'string',
          id: 2
        },
        bridge_inst_id: {
          type: 'string',
          id: 3
        },
        other_bridge_inst_id: {
          type: 'string',
          id: 4
        },
        bridge_side: {
          type: 'int32',
          id: 5
        },
        status: {
          type: 'int32',
          id: 6
        },
        tag_info: {
          type: 'BridgeTagStruct',
          id: 7
        },
        flag_double_bridge: {
          type: 'bool',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        bridge_code: {
          type: 'string',
          id: 9
        },
        serial_number: {
          type: 'int32',
          id: 10
        }
      }
    },
    BridgeDealStruct: {
      fields: {
        bridge_record: {
          type: 'BridgeRecordStruct',
          id: 1
        },
        spot_pricing_deal: {
          type: 'SpotPricingStruct',
          id: 2
        }
      }
    },
    BridgeTagStruct: {
      oneofs: {
        _double_bridge_detail: {
          oneof: ['double_bridge_detail']
        }
      },
      fields: {
        bridge_code: {
          type: 'string',
          id: 1
        },
        ofr_bridge_detail: {
          type: 'BridgeDetailStruct',
          id: 2
        },
        bid_bridge_detail: {
          type: 'BridgeDetailStruct',
          id: 3
        },
        double_bridge_detail: {
          type: 'DoubleBridgeDetailStruct',
          id: 5,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    BridgeDetailStruct: {
      oneofs: {
        _special_brokerage: {
          oneof: ['special_brokerage']
        },
        _comment: {
          oneof: ['comment']
        }
      },
      fields: {
        bridge_inst: {
          type: 'BridgeInstStruct',
          id: 1
        },
        inst_trader: {
          type: 'DealInstTraderStruct',
          id: 2
        },
        bridge_side: {
          type: 'int32',
          id: 3
        },
        cost: {
          type: 'float',
          id: 4
        },
        special_brokerage: {
          type: 'float',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        liquidation_speed_list: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 6
        },
        flag_hide_comment: {
          type: 'bool',
          id: 7
        },
        send_order_info: {
          rule: 'repeated',
          type: 'SendOrderInfoStruct',
          id: 8
        },
        comment: {
          type: 'string',
          id: 9,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    DoubleBridgeDetailStruct: {
      fields: {
        send_msg: {
          type: 'string',
          id: 1
        },
        cost: {
          type: 'float',
          id: 2
        },
        comment: {
          type: 'string',
          id: 3
        },
        channel: {
          type: 'BridgeChannelEnum',
          id: 4
        },
        stagger_date: {
          type: 'int32',
          id: 5
        },
        bridge_side: {
          type: 'int32',
          id: 6
        }
      }
    },
    SendOrderInfoStruct: {
      fields: {
        send_order_inst: {
          type: 'InstitutionTinyStruct',
          id: 1
        },
        volume: {
          type: 'float',
          id: 2
        }
      }
    },
    SpotPricingMessageStruct: {
      oneofs: {
        _quote_trader_info: {
          oneof: ['quote_trader_info']
        },
        _quote_inst_info: {
          oneof: ['quote_inst_info']
        },
        _quote_price: {
          oneof: ['quote_price']
        },
        _quote_volume: {
          oneof: ['quote_volume']
        },
        _confirm_volume: {
          oneof: ['confirm_volume']
        },
        _return_point: {
          oneof: ['return_point']
        },
        _im_msg_text: {
          oneof: ['im_msg_text']
        },
        _quote_id: {
          oneof: ['quote_id']
        },
        _contract_id: {
          oneof: ['contract_id']
        },
        _message_record_id: {
          oneof: ['message_record_id']
        }
      },
      fields: {
        spot_pricing_message_id: {
          type: 'string',
          id: 1
        },
        quote_trader_info: {
          type: 'TraderLiteStruct',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        quote_broker_info: {
          type: 'UserStruct',
          id: 3
        },
        quote_inst_info: {
          type: 'InstitutionTinyStruct',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        quote_price: {
          type: 'double',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        quote_volume: {
          type: 'double',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        confirm_volume: {
          type: 'double',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        spot_pricing_confirm_status: {
          type: 'SpotPricingConfirmStatusEnum',
          id: 8
        },
        return_point: {
          type: 'double',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        im_msg_text: {
          type: 'string',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        im_msg_send_status: {
          type: 'SpotPricingImMsgSendStatusEnum',
          id: 11
        },
        quote_id: {
          type: 'string',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        contract_id: {
          type: 'string',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        message_record_id: {
          type: 'string',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        bid_confirm_status: {
          type: 'SpotPricingConfirmStatusEnum',
          id: 15
        },
        ofr_confirm_status: {
          type: 'SpotPricingConfirmStatusEnum',
          id: 16
        },
        deal_liquidation_speed_list: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 17
        }
      }
    },
    SpotPricingRecordStruct: {
      oneofs: {
        _bond_info: {
          oneof: ['bond_info']
        },
        _spot_pricing_trader_info: {
          oneof: ['spot_pricing_trader_info']
        },
        _spot_pricing_inst_info: {
          oneof: ['spot_pricing_inst_info']
        },
        _spot_pricing_volume: {
          oneof: ['spot_pricing_volume']
        },
        _spot_pricing_price: {
          oneof: ['spot_pricing_price']
        },
        _return_point: {
          oneof: ['return_point']
        },
        _unmatch_volume: {
          oneof: ['unmatch_volume']
        },
        _bond_basic_info: {
          oneof: ['bond_basic_info']
        }
      },
      fields: {
        spot_record_id: {
          type: 'string',
          id: 1
        },
        bond_info: {
          type: 'BondLiteStruct',
          id: 2,
          options: {
            deprecated: true,
            proto3_optional: true
          }
        },
        spot_pricing_time: {
          type: 'string',
          id: 3
        },
        sp_liquidation_speed_list: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 4
        },
        spot_pricing_trader_info: {
          type: 'TraderLiteStruct',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        spot_pricing_broker_info: {
          type: 'UserStruct',
          id: 6
        },
        spot_pricing_inst_info: {
          type: 'InstitutionTinyStruct',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        deal_type: {
          type: 'DealTypeEnum',
          id: 8
        },
        spot_pricing_volume: {
          type: 'double',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        spot_pricing_price: {
          type: 'double',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        spot_pricing_message_list: {
          rule: 'repeated',
          type: 'SpotPricingMessageStruct',
          id: 11
        },
        return_point: {
          type: 'double',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        spot_pricing_quote_list: {
          rule: 'repeated',
          type: 'SpotPricingQuoteStruct',
          id: 13
        },
        receiver_side: {
          type: 'ReceiverSideEnum',
          id: 14
        },
        unmatch_volume: {
          type: 'double',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        bond_basic_info: {
          type: 'FiccBondBasicStruct',
          id: 16,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    IdcDealDetailStruct: {
      oneofs: {
        _spot_pricing_record: {
          oneof: ['spot_pricing_record']
        }
      },
      fields: {
        deal_list: {
          rule: 'repeated',
          type: 'SpotPricingStruct',
          id: 1
        },
        spot_pricing_record: {
          type: 'SpotPricingRecordStruct',
          id: 2,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    SpotPricingQuoteStruct: {
      oneofs: {
        _quote_id: {
          oneof: ['quote_id']
        },
        _flag_stock_exchange: {
          oneof: ['flag_stock_exchange']
        },
        _is_exercise: {
          oneof: ['is_exercise']
        },
        _flag_indivisible: {
          oneof: ['flag_indivisible']
        },
        _flag_star: {
          oneof: ['flag_star']
        },
        _flag_package: {
          oneof: ['flag_package']
        },
        _flag_oco: {
          oneof: ['flag_oco']
        },
        _flag_exchange: {
          oneof: ['flag_exchange']
        },
        _flag_internal: {
          oneof: ['flag_internal']
        },
        _comment: {
          oneof: ['comment']
        },
        _flag_urgent: {
          oneof: ['flag_urgent']
        },
        _flag_request: {
          oneof: ['flag_request']
        },
        _flag_bilateral: {
          oneof: ['flag_bilateral']
        },
        _flag_rebate: {
          oneof: ['flag_rebate']
        },
        _yield: {
          oneof: ['yield']
        },
        _full_price: {
          oneof: ['full_price']
        },
        _spread: {
          oneof: ['spread']
        },
        _return_point: {
          oneof: ['return_point']
        },
        _trader_tag: {
          oneof: ['trader_tag']
        },
        _price: {
          oneof: ['price']
        },
        _exercise_manual: {
          oneof: ['exercise_manual']
        }
      },
      fields: {
        quote_id: {
          type: 'string',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        spot_pricing_failed_reason: {
          type: 'SpotPricingFailedReasonEnum',
          id: 2
        },
        flag_stock_exchange: {
          type: 'bool',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        is_exercise: {
          type: 'bool',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        flag_indivisible: {
          type: 'bool',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        flag_star: {
          type: 'int32',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        flag_package: {
          type: 'bool',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        flag_oco: {
          type: 'bool',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        flag_exchange: {
          type: 'bool',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        flag_internal: {
          type: 'bool',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        comment: {
          type: 'string',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        quote_liquidation_speed_list: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 12
        },
        flag_urgent: {
          type: 'bool',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        flag_request: {
          type: 'bool',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        flag_bilateral: {
          type: 'bool',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        flag_rebate: {
          type: 'bool',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        quote_volume: {
          type: 'double',
          id: 17
        },
        yield: {
          type: 'double',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        full_price: {
          type: 'double',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        spread: {
          type: 'double',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        quote_type: {
          type: 'BondQuoteTypeEnum',
          id: 21
        },
        return_point: {
          type: 'double',
          id: 22,
          options: {
            proto3_optional: true
          }
        },
        trader_tag: {
          type: 'string',
          id: 23,
          options: {
            proto3_optional: true
          }
        },
        price: {
          type: 'double',
          id: 24,
          options: {
            proto3_optional: true
          }
        },
        exercise_manual: {
          type: 'bool',
          id: 25,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    DealOperationLogV2Struct: {
      oneofs: {
        _before_deal_snapshot: {
          oneof: ['before_deal_snapshot']
        },
        _after_deal_snapshot: {
          oneof: ['after_deal_snapshot']
        },
        _operation_source: {
          oneof: ['operation_source']
        }
      },
      fields: {
        log_id: {
          type: 'string',
          id: 1
        },
        deal_id: {
          type: 'string',
          id: 2
        },
        operator: {
          type: 'UserLiteStruct',
          id: 3
        },
        operation_type: {
          type: 'DealOperationTypeEnum',
          id: 4
        },
        create_time: {
          type: 'string',
          id: 5
        },
        before_deal_snapshot: {
          type: 'BondDealLogStruct',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        after_deal_snapshot: {
          type: 'BondDealLogStruct',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        operation_source: {
          type: 'OperationSourceEnum',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        update_types: {
          rule: 'repeated',
          type: 'DealRecordUpdateTypeEnum',
          id: 9
        }
      }
    },
    DealDetailOperationLogStruct: {
      oneofs: {
        _before_deal_snapshot: {
          oneof: ['before_deal_snapshot']
        },
        _after_deal_snapshot: {
          oneof: ['after_deal_snapshot']
        }
      },
      fields: {
        log_id: {
          type: 'string',
          id: 1
        },
        deal_id: {
          type: 'string',
          id: 2
        },
        operator: {
          type: 'UserLiteStruct',
          id: 3
        },
        operation_type: {
          type: 'DealOperationTypeEnum',
          id: 4
        },
        create_time: {
          type: 'string',
          id: 5
        },
        before_deal_snapshot: {
          type: 'DealDetailLogStruct',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        after_deal_snapshot: {
          type: 'DealDetailLogStruct',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        operation_source: {
          type: 'OperationSourceEnum',
          id: 8
        },
        update_types: {
          rule: 'repeated',
          type: 'DealDetailUpdateTypeEnum',
          id: 9
        }
      }
    },
    DealDetailOperationLogUpdateStruct: {
      fields: {
        update_type: {
          type: 'DealDetailUpdateTypeEnum',
          id: 1
        },
        before: {
          type: 'string',
          id: 2
        },
        after: {
          type: 'string',
          id: 3
        }
      }
    },
    BondDealLogStruct: {
      oneofs: {
        _snapshot: {
          oneof: ['snapshot']
        },
        _stagger_date: {
          oneof: ['stagger_date']
        },
        _flag_bid_pay_for_inst: {
          oneof: ['flag_bid_pay_for_inst']
        },
        _flag_ofr_pay_for_inst: {
          oneof: ['flag_ofr_pay_for_inst']
        }
      },
      fields: {
        snapshot: {
          type: 'BondDealStruct',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        be_clone_internal_code: {
          rule: 'repeated',
          type: 'string',
          id: 2
        },
        stagger_date: {
          type: 'int32',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        details: {
          rule: 'repeated',
          type: 'DealDetailLogChildStruct',
          id: 4
        },
        flag_bid_pay_for_inst: {
          type: 'bool',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        flag_ofr_pay_for_inst: {
          type: 'bool',
          id: 6,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    DealDetailLogStruct: {
      oneofs: {
        _bid_send_order_msg: {
          oneof: ['bid_send_order_msg']
        },
        _ofr_send_order_msg: {
          oneof: ['ofr_send_order_msg']
        },
        _flag_bid_pay_for_inst: {
          oneof: ['flag_bid_pay_for_inst']
        },
        _flag_ofr_pay_for_inst: {
          oneof: ['flag_ofr_pay_for_inst']
        }
      },
      fields: {
        deal_id: {
          type: 'string',
          id: 1
        },
        bid_send_order_msg: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        ofr_send_order_msg: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        details: {
          rule: 'repeated',
          type: 'DealDetailLogChildStruct',
          id: 4
        },
        flag_bid_pay_for_inst: {
          type: 'bool',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        flag_ofr_pay_for_inst: {
          type: 'bool',
          id: 6,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    DealDetailLogChildStruct: {
      oneofs: {
        _bid_inst_snapshot: {
          oneof: ['bid_inst_snapshot']
        },
        _bid_trader_snapshot: {
          oneof: ['bid_trader_snapshot']
        },
        _ofr_inst_snapshot: {
          oneof: ['ofr_inst_snapshot']
        },
        _ofr_trader_snapshot: {
          oneof: ['ofr_trader_snapshot']
        },
        _bridge_direction: {
          oneof: ['bridge_direction']
        },
        _send_msg: {
          oneof: ['send_msg']
        },
        _bridge_channel: {
          oneof: ['bridge_channel']
        },
        _fee: {
          oneof: ['fee']
        },
        _send_order_comment: {
          oneof: ['send_order_comment']
        },
        _flag_hide_comment: {
          oneof: ['flag_hide_comment']
        },
        _bridge_comment: {
          oneof: ['bridge_comment']
        },
        _bid_flag_bridge: {
          oneof: ['bid_flag_bridge']
        },
        _ofr_flag_bridge: {
          oneof: ['ofr_flag_bridge']
        },
        _bid_trader_tag: {
          oneof: ['bid_trader_tag']
        },
        _ofr_trader_tag: {
          oneof: ['ofr_trader_tag']
        }
      },
      fields: {
        child_deal_id: {
          type: 'string',
          id: 1
        },
        bid_inst_id: {
          type: 'string',
          id: 2
        },
        bid_trader_id: {
          type: 'string',
          id: 3
        },
        bid_inst_snapshot: {
          type: 'InstitutionTinyStruct',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        bid_trader_snapshot: {
          type: 'TraderStruct',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        ofr_inst_id: {
          type: 'string',
          id: 6
        },
        ofr_trader_id: {
          type: 'string',
          id: 7
        },
        ofr_inst_snapshot: {
          type: 'InstitutionTinyStruct',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        ofr_trader_snapshot: {
          type: 'TraderStruct',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        bridge_direction: {
          type: 'BridgeDirectionEnum',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        send_msg: {
          type: 'string',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        bridge_channel: {
          type: 'BridgeChannelEnum',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        fee: {
          type: 'double',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        send_order_comment: {
          type: 'string',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        flag_hide_comment: {
          type: 'bool',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        send_order_inst_info: {
          rule: 'repeated',
          type: 'SendOrderInstStruct',
          id: 16
        },
        bridge_comment: {
          type: 'string',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        bid_flag_bridge: {
          type: 'bool',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        ofr_flag_bridge: {
          type: 'bool',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        bid_trader_tag: {
          type: 'string',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        ofr_trader_tag: {
          type: 'string',
          id: 21,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    MarketClosingTimeStruct: {
      fields: {
        start: {
          type: 'int32',
          id: 1
        },
        end: {
          type: 'int32',
          id: 2
        }
      }
    },
    DealUnreadNotifyDetailStruct: {
      fields: {
        deal_notify_info: {
          type: 'DealNotifyStruct',
          id: 1
        },
        idc_deal_detail: {
          type: 'IdcDealDetailStruct',
          id: 2
        }
      }
    },
    DealNotifyStruct: {
      fields: {
        notify_id: {
          type: 'string',
          id: 1
        },
        create_time: {
          type: 'string',
          id: 2
        },
        receiver_side: {
          type: 'ReceiverSideEnum',
          id: 3
        },
        NotifyType: {
          type: 'NotifyTypeEnum',
          id: 4
        }
      }
    },
    DataFeedStruct: {
      fields: {
        sync_data_type: {
          type: 'SyncDataTypeEnum',
          id: 1
        },
        trader_list: {
          rule: 'repeated',
          type: 'TraderSyncStruct',
          id: 2
        },
        inst_list: {
          rule: 'repeated',
          type: 'InstSyncStruct',
          id: 3
        },
        user_list: {
          rule: 'repeated',
          type: 'UserSyncStruct',
          id: 4
        },
        quote_list: {
          rule: 'repeated',
          type: 'QuoteSyncStruct',
          id: 5
        },
        bond_basic_list: {
          rule: 'repeated',
          type: 'BondBasicSyncStruct',
          id: 6
        },
        bond_appendix_list: {
          rule: 'repeated',
          type: 'BondAppendixSyncStruct',
          id: 7
        },
        quote_draft_message_list: {
          rule: 'repeated',
          type: 'QuoteDraftMessageSyncStruct',
          id: 8
        },
        quote_draft_detail_list: {
          rule: 'repeated',
          type: 'QuoteDraftDetailSyncStruct',
          id: 9
        },
        deal_info_list: {
          rule: 'repeated',
          type: 'DealInfoSyncStruct',
          id: 10
        },
        bond_detail_list: {
          rule: 'repeated',
          type: 'BondDetailSyncStruct',
          id: 11
        }
      }
    },
    DataFeedCompressedStruct: {
      fields: {
        sync_data_type: {
          type: 'SyncDataTypeEnum',
          id: 1
        },
        data: {
          type: 'bytes',
          id: 2
        }
      }
    },
    QuoteDraftMessageConfirmStruct: {
      fields: {
        message_id: {
          type: 'string',
          id: 1
        },
        inst_id: {
          type: 'string',
          id: 2
        },
        trader_id: {
          type: 'string',
          id: 3
        },
        broker_id: {
          type: 'string',
          id: 4
        },
        trader_tag: {
          type: 'string',
          id: 5
        }
      }
    },
    QuoteDraftDetailConfirmStruct: {
      oneofs: {
        _former_detail_id: {
          oneof: ['former_detail_id']
        }
      },
      fields: {
        detail_id: {
          type: 'string',
          id: 1
        },
        message_id: {
          type: 'string',
          id: 2
        },
        corresponding_line: {
          type: 'int32',
          id: 3
        },
        side: {
          type: 'SideEnum',
          id: 4
        },
        key_market: {
          type: 'string',
          id: 5
        },
        quote_type: {
          type: 'BondQuoteTypeEnum',
          id: 6
        },
        price: {
          type: 'double',
          id: 7
        },
        volume: {
          type: 'double',
          id: 8
        },
        return_point: {
          type: 'double',
          id: 9
        },
        flag_rebate: {
          type: 'bool',
          id: 10
        },
        flag_star: {
          type: 'int32',
          id: 11
        },
        flag_package: {
          type: 'bool',
          id: 12
        },
        flag_oco: {
          type: 'bool',
          id: 13
        },
        flag_exchange: {
          type: 'bool',
          id: 14
        },
        flag_intention: {
          type: 'bool',
          id: 15
        },
        flag_indivisible: {
          type: 'bool',
          id: 16
        },
        flag_stock_exchange: {
          type: 'bool',
          id: 17
        },
        flag_bilateral: {
          type: 'bool',
          id: 18
        },
        flag_request: {
          type: 'bool',
          id: 19
        },
        flag_urgent: {
          type: 'bool',
          id: 20
        },
        flag_internal: {
          type: 'bool',
          id: 21
        },
        flag_recommend: {
          type: 'bool',
          id: 22
        },
        liquidation_speed_list: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 23
        },
        comment: {
          type: 'string',
          id: 24
        },
        is_exercise: {
          type: 'bool',
          id: 25
        },
        exercise_manual: {
          type: 'bool',
          id: 26
        },
        status: {
          type: 'QuoteDraftDetailStatusEnum',
          id: 27
        },
        former_detail_id: {
          type: 'string',
          id: 28,
          options: {
            proto3_optional: true
          }
        },
        flag_inverted: {
          type: 'bool',
          id: 29
        }
      }
    },
    QuoteDraftDetailUpsertStruct: {
      oneofs: {
        _detail_id: {
          oneof: ['detail_id']
        },
        _message_id: {
          oneof: ['message_id']
        },
        _corresponding_line: {
          oneof: ['corresponding_line']
        },
        _side: {
          oneof: ['side']
        },
        _key_market: {
          oneof: ['key_market']
        },
        _quote_type: {
          oneof: ['quote_type']
        },
        _product_type: {
          oneof: ['product_type']
        },
        _price: {
          oneof: ['price']
        },
        _volume: {
          oneof: ['volume']
        },
        _return_point: {
          oneof: ['return_point']
        },
        _flag_rebate: {
          oneof: ['flag_rebate']
        },
        _flag_star: {
          oneof: ['flag_star']
        },
        _flag_package: {
          oneof: ['flag_package']
        },
        _flag_oco: {
          oneof: ['flag_oco']
        },
        _flag_exchange: {
          oneof: ['flag_exchange']
        },
        _flag_intention: {
          oneof: ['flag_intention']
        },
        _flag_indivisible: {
          oneof: ['flag_indivisible']
        },
        _flag_stock_exchange: {
          oneof: ['flag_stock_exchange']
        },
        _flag_bilateral: {
          oneof: ['flag_bilateral']
        },
        _flag_request: {
          oneof: ['flag_request']
        },
        _flag_urgent: {
          oneof: ['flag_urgent']
        },
        _flag_internal: {
          oneof: ['flag_internal']
        },
        _flag_recommend: {
          oneof: ['flag_recommend']
        },
        _comment: {
          oneof: ['comment']
        },
        _is_exercise: {
          oneof: ['is_exercise']
        },
        _exercise_manual: {
          oneof: ['exercise_manual']
        },
        _status: {
          oneof: ['status']
        },
        _former_detail_id: {
          oneof: ['former_detail_id']
        },
        _flag_inverted: {
          oneof: ['flag_inverted']
        }
      },
      fields: {
        detail_id: {
          type: 'string',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        message_id: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        corresponding_line: {
          type: 'int32',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        side: {
          type: 'SideEnum',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        key_market: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        quote_type: {
          type: 'BondQuoteTypeEnum',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        product_type: {
          type: 'ProductTypeEnum',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        price: {
          type: 'double',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        volume: {
          type: 'double',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        return_point: {
          type: 'double',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        flag_rebate: {
          type: 'bool',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        flag_star: {
          type: 'int32',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        flag_package: {
          type: 'bool',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        flag_oco: {
          type: 'bool',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        flag_exchange: {
          type: 'bool',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        flag_intention: {
          type: 'bool',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        flag_indivisible: {
          type: 'bool',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        flag_stock_exchange: {
          type: 'bool',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        flag_bilateral: {
          type: 'bool',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        flag_request: {
          type: 'bool',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        flag_urgent: {
          type: 'bool',
          id: 21,
          options: {
            proto3_optional: true
          }
        },
        flag_internal: {
          type: 'bool',
          id: 22,
          options: {
            proto3_optional: true
          }
        },
        flag_recommend: {
          type: 'bool',
          id: 23,
          options: {
            proto3_optional: true
          }
        },
        liquidation_speed_list: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 24
        },
        comment: {
          type: 'string',
          id: 25,
          options: {
            proto3_optional: true
          }
        },
        is_exercise: {
          type: 'bool',
          id: 26,
          options: {
            proto3_optional: true
          }
        },
        exercise_manual: {
          type: 'bool',
          id: 27,
          options: {
            proto3_optional: true
          }
        },
        status: {
          type: 'QuoteDraftDetailStatusEnum',
          id: 28,
          options: {
            proto3_optional: true
          }
        },
        former_detail_id: {
          type: 'string',
          id: 29,
          options: {
            proto3_optional: true
          }
        },
        flag_inverted: {
          type: 'bool',
          id: 30,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    BondDealStruct: {
      oneofs: {
        _send_order_msg: {
          oneof: ['send_order_msg']
        },
        _bid_send_order_msg: {
          oneof: ['bid_send_order_msg']
        },
        _ofr_send_order_msg: {
          oneof: ['ofr_send_order_msg']
        },
        _bond_info: {
          oneof: ['bond_info']
        },
        _price_type: {
          oneof: ['price_type']
        },
        _price: {
          oneof: ['price']
        },
        _yield: {
          oneof: ['yield']
        },
        _clean_price: {
          oneof: ['clean_price']
        },
        _full_price: {
          oneof: ['full_price']
        },
        _return_point: {
          oneof: ['return_point']
        },
        _bid_traded_date: {
          oneof: ['bid_traded_date']
        },
        _bid_delivery_date: {
          oneof: ['bid_delivery_date']
        },
        _ofr_traded_date: {
          oneof: ['ofr_traded_date']
        },
        _ofr_delivery_date: {
          oneof: ['ofr_delivery_date']
        },
        _flag_exchange: {
          oneof: ['flag_exchange']
        },
        _exercise_type: {
          oneof: ['exercise_type']
        },
        _deal_status: {
          oneof: ['deal_status']
        },
        _spot_pricinger: {
          oneof: ['spot_pricinger']
        },
        _spot_pricingee: {
          oneof: ['spot_pricingee']
        },
        _spot_pricing_record_id: {
          oneof: ['spot_pricing_record_id']
        },
        _flag_internal: {
          oneof: ['flag_internal']
        },
        _operator: {
          oneof: ['operator']
        },
        _listed_market: {
          oneof: ['listed_market']
        },
        _bid_bridge_operator: {
          oneof: ['bid_bridge_operator']
        },
        _ofr_bridge_operator: {
          oneof: ['ofr_bridge_operator']
        },
        _im_msg_text: {
          oneof: ['im_msg_text']
        },
        _im_msg_send_status: {
          oneof: ['im_msg_send_status']
        },
        _im_msg_record_id: {
          oneof: ['im_msg_record_id']
        },
        _quote_id: {
          oneof: ['quote_id']
        },
        _spot_pricing_volume: {
          oneof: ['spot_pricing_volume']
        },
        _bid_old_content: {
          oneof: ['bid_old_content']
        },
        _ofr_old_content: {
          oneof: ['ofr_old_content']
        },
        _exercise_manual: {
          oneof: ['exercise_manual']
        },
        _bond_basic_info: {
          oneof: ['bond_basic_info']
        },
        _hand_over_status: {
          oneof: ['hand_over_status']
        },
        _clone_source_internal_code: {
          oneof: ['clone_source_internal_code']
        }
      },
      fields: {
        deal_id: {
          type: 'string',
          id: 1
        },
        internal_code: {
          type: 'string',
          id: 2
        },
        create_time: {
          type: 'string',
          id: 3
        },
        update_time: {
          type: 'string',
          id: 4
        },
        deal_type: {
          type: 'DealTypeEnum',
          id: 5
        },
        source: {
          type: 'OperationSourceEnum',
          id: 6
        },
        flag_bridge: {
          type: 'bool',
          id: 7
        },
        send_order_msg: {
          type: 'string',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        bid_send_order_msg: {
          type: 'string',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        ofr_send_order_msg: {
          type: 'string',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        bond_info: {
          type: 'BondLiteStruct',
          id: 11,
          options: {
            deprecated: true,
            proto3_optional: true
          }
        },
        confirm_volume: {
          type: 'double',
          id: 12
        },
        price_type: {
          type: 'BondQuoteTypeEnum',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        price: {
          type: 'double',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        yield: {
          type: 'double',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        clean_price: {
          type: 'double',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        full_price: {
          type: 'double',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        return_point: {
          type: 'double',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        bid_settlement_type: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 19
        },
        bid_traded_date: {
          type: 'string',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        bid_delivery_date: {
          type: 'string',
          id: 21,
          options: {
            proto3_optional: true
          }
        },
        ofr_settlement_type: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 22
        },
        ofr_traded_date: {
          type: 'string',
          id: 23,
          options: {
            proto3_optional: true
          }
        },
        ofr_delivery_date: {
          type: 'string',
          id: 24,
          options: {
            proto3_optional: true
          }
        },
        flag_exchange: {
          type: 'bool',
          id: 25,
          options: {
            proto3_optional: true
          }
        },
        exercise_type: {
          type: 'ExerciseTypeEnum',
          id: 26,
          options: {
            proto3_optional: true
          }
        },
        deal_status: {
          type: 'BondDealStatusEnum',
          id: 27,
          options: {
            proto3_optional: true
          }
        },
        spot_pricinger: {
          type: 'CounterpartyStruct',
          id: 28,
          options: {
            proto3_optional: true
          }
        },
        spot_pricingee: {
          type: 'CounterpartyStruct',
          id: 29,
          options: {
            proto3_optional: true
          }
        },
        spot_pricing_record_id: {
          type: 'string',
          id: 30,
          options: {
            deprecated: true,
            proto3_optional: true
          }
        },
        flag_internal: {
          type: 'bool',
          id: 31,
          options: {
            proto3_optional: true
          }
        },
        operator: {
          type: 'UserLiteStruct',
          id: 32,
          options: {
            proto3_optional: true
          }
        },
        listed_market: {
          type: 'ListedMarketEnum',
          id: 33,
          options: {
            deprecated: true,
            proto3_optional: true
          }
        },
        bid_bridge_operator: {
          type: 'UserLiteStruct',
          id: 34,
          options: {
            deprecated: true,
            proto3_optional: true
          }
        },
        ofr_bridge_operator: {
          type: 'UserLiteStruct',
          id: 35,
          options: {
            deprecated: true,
            proto3_optional: true
          }
        },
        im_msg_text: {
          type: 'string',
          id: 36,
          options: {
            proto3_optional: true
          }
        },
        im_msg_send_status: {
          type: 'ImMsgSendStatusEnum',
          id: 37,
          options: {
            proto3_optional: true
          }
        },
        im_msg_record_id: {
          type: 'string',
          id: 38,
          options: {
            deprecated: true,
            proto3_optional: true
          }
        },
        quote_id: {
          type: 'string',
          id: 39,
          options: {
            proto3_optional: true
          }
        },
        spot_pricing_volume: {
          type: 'double',
          id: 40,
          options: {
            proto3_optional: true
          }
        },
        bid_old_content: {
          type: 'OldContentStruct',
          id: 41,
          options: {
            deprecated: true,
            proto3_optional: true
          }
        },
        ofr_old_content: {
          type: 'OldContentStruct',
          id: 42,
          options: {
            deprecated: true,
            proto3_optional: true
          }
        },
        bid_deal_read_status: {
          type: 'DealReadStatusEnum',
          id: 43,
          options: {
            deprecated: true
          }
        },
        ofr_deal_read_status: {
          type: 'DealReadStatusEnum',
          id: 44,
          options: {
            deprecated: true
          }
        },
        exercise_manual: {
          type: 'bool',
          id: 45,
          options: {
            proto3_optional: true
          }
        },
        bond_basic_info: {
          type: 'FiccBondBasicStruct',
          id: 46,
          options: {
            proto3_optional: true
          }
        },
        hand_over_status: {
          type: 'DealHandOverStatusEnum',
          id: 47,
          options: {
            deprecated: true,
            proto3_optional: true
          }
        },
        clone_source_internal_code: {
          type: 'string',
          id: 48,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    CounterpartyStruct: {
      oneofs: {
        _inst: {
          oneof: ['inst']
        },
        _trader: {
          oneof: ['trader']
        },
        _broker: {
          oneof: ['broker']
        },
        _flag_modify_brokerage: {
          oneof: ['flag_modify_brokerage']
        },
        _modify_brokerage_reason: {
          oneof: ['modify_brokerage_reason']
        },
        _confirm_status: {
          oneof: ['confirm_status']
        },
        _brokerage_comment: {
          oneof: ['brokerage_comment']
        },
        _broker_b: {
          oneof: ['broker_b']
        },
        _broker_c: {
          oneof: ['broker_c']
        },
        _broker_d: {
          oneof: ['broker_d']
        }
      },
      fields: {
        inst: {
          type: 'InstitutionTinyStruct',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        trader: {
          type: 'TraderLiteStruct',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        broker: {
          type: 'UserStruct',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        flag_modify_brokerage: {
          type: 'bool',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        modify_brokerage_reason: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        confirm_status: {
          type: 'BondDealStatusEnum',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        brokerage_comment: {
          type: 'ReceiptDealTradeInstBrokerageCommentEnum',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        broker_b: {
          type: 'UserStruct',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        broker_c: {
          type: 'UserStruct',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        broker_d: {
          type: 'UserStruct',
          id: 10,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    BridgeInstInfoStruct: {
      oneofs: {
        _receipt_deal_count: {
          oneof: ['receipt_deal_count']
        }
      },
      fields: {
        bridge_inst_id: {
          type: 'string',
          id: 1
        },
        contact_inst: {
          type: 'InstitutionTinyStruct',
          id: 2
        },
        contact_trader: {
          type: 'TraderLiteStruct',
          id: 3
        },
        bill_inst: {
          type: 'InstitutionTinyStruct',
          id: 4
        },
        bill_trader: {
          type: 'TraderLiteStruct',
          id: 5
        },
        send_msg: {
          type: 'string',
          id: 6
        },
        channel: {
          type: 'BridgeChannelEnum',
          id: 7
        },
        comment: {
          type: 'string',
          id: 8
        },
        contact: {
          type: 'string',
          id: 9
        },
        bridge_status: {
          type: 'int32',
          id: 10
        },
        create_time: {
          type: 'string',
          id: 11
        },
        update_time: {
          type: 'string',
          id: 12
        },
        receipt_deal_count: {
          type: 'int32',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        is_valid: {
          type: 'bool',
          id: 14
        }
      }
    },
    DealBridgeStruct: {
      fields: {
        bridge_record: {
          type: 'BridgeStruct',
          id: 1
        },
        deal_detail: {
          type: 'BondDealStruct',
          id: 2
        }
      }
    },
    BridgeStruct: {
      oneofs: {
        _other_bridge_inst_id: {
          oneof: ['other_bridge_inst_id']
        },
        _flag_double_bridge: {
          oneof: ['flag_double_bridge']
        }
      },
      fields: {
        bridge_record_id: {
          type: 'string',
          id: 1
        },
        deal_id: {
          type: 'string',
          id: 2
        },
        bridge_inst_id: {
          type: 'string',
          id: 3
        },
        other_bridge_inst_id: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        bridge_side: {
          type: 'int32',
          id: 5
        },
        status: {
          type: 'int32',
          id: 6
        },
        bridge_tag_form: {
          type: 'BridgeTagFormStruct',
          id: 7
        },
        flag_double_bridge: {
          type: 'bool',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        serial_number: {
          type: 'int32',
          id: 9
        }
      }
    },
    BridgeTagFormStruct: {
      oneofs: {
        _double_bridge_detail: {
          oneof: ['double_bridge_detail']
        }
      },
      fields: {
        bridge_code: {
          type: 'string',
          id: 1
        },
        ofr_bridge_detail: {
          type: 'BridgeDetailV2Struct',
          id: 2
        },
        bid_bridge_detail: {
          type: 'BridgeDetailV2Struct',
          id: 3
        },
        double_bridge_detail: {
          type: 'DoubleBridgeDetailStruct',
          id: 5,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    BridgeDetailV2Struct: {
      oneofs: {
        _bill_inst: {
          oneof: ['bill_inst']
        },
        _bill_trader: {
          oneof: ['bill_trader']
        },
        _contact: {
          oneof: ['contact']
        },
        _deal_inst: {
          oneof: ['deal_inst']
        },
        _deal_trader: {
          oneof: ['deal_trader']
        },
        _send_msg: {
          oneof: ['send_msg']
        },
        _send_order_comment: {
          oneof: ['send_order_comment']
        },
        _cost: {
          oneof: ['cost']
        },
        _special_brokerage: {
          oneof: ['special_brokerage']
        },
        _bridge_comment: {
          oneof: ['bridge_comment']
        }
      },
      fields: {
        bridge_inst_id: {
          type: 'string',
          id: 1
        },
        contact_inst: {
          type: 'InstitutionTinyStruct',
          id: 2
        },
        contact_trader: {
          type: 'TraderLiteStruct',
          id: 3
        },
        bill_inst: {
          type: 'InstitutionTinyStruct',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        bill_trader: {
          type: 'TraderLiteStruct',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        contact: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        deal_inst: {
          type: 'InstitutionTinyStruct',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        deal_trader: {
          type: 'TraderLiteStruct',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        bridge_direction: {
          type: 'BridgeDirectionEnum',
          id: 9
        },
        send_msg: {
          type: 'string',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        channel: {
          type: 'BridgeChannelEnum',
          id: 11
        },
        send_order_comment: {
          type: 'string',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        cost: {
          type: 'float',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        special_brokerage: {
          type: 'float',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        liquidation_speed_list: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 15
        },
        flag_hide_comment: {
          type: 'bool',
          id: 16
        },
        send_order_info: {
          rule: 'repeated',
          type: 'SendOrderInfoStruct',
          id: 17
        },
        bridge_comment: {
          type: 'string',
          id: 18,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    SpotPricingDetailStruct: {
      oneofs: {
        _spot_pricing_record: {
          oneof: ['spot_pricing_record']
        }
      },
      fields: {
        deal_list: {
          rule: 'repeated',
          type: 'BondDealStruct',
          id: 1
        },
        spot_pricing_record: {
          type: 'SpotPricingRecordStruct',
          id: 2,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    DealUnreadNotifyStruct: {
      fields: {
        deal_notify_info: {
          type: 'DealNotifyStruct',
          id: 1
        },
        spot_pricing_detail: {
          type: 'SpotPricingDetailStruct',
          id: 2
        }
      }
    },
    OppositePriceNotificationStruct: {
      oneofs: {
        _quote_price: {
          oneof: ['quote_price']
        },
        _flag_intention: {
          oneof: ['flag_intention']
        },
        _flag_internal: {
          oneof: ['flag_internal']
        },
        _flag_urgent: {
          oneof: ['flag_urgent']
        },
        _flag_exchange: {
          oneof: ['flag_exchange']
        },
        _flag_star: {
          oneof: ['flag_star']
        },
        _flag_oco: {
          oneof: ['flag_oco']
        },
        _flag_package: {
          oneof: ['flag_package']
        },
        _flag_recommend: {
          oneof: ['flag_recommend']
        },
        _flag_indivisible: {
          oneof: ['flag_indivisible']
        },
        _flag_stock_exchange: {
          oneof: ['flag_stock_exchange']
        },
        _flag_bilateral: {
          oneof: ['flag_bilateral']
        },
        _flag_request: {
          oneof: ['flag_request']
        },
        _comment: {
          oneof: ['comment']
        },
        _return_point: {
          oneof: ['return_point']
        },
        _volume: {
          oneof: ['volume']
        },
        _send_failed_reason: {
          oneof: ['send_failed_reason']
        },
        _trader_tag: {
          oneof: ['trader_tag']
        },
        _enable: {
          oneof: ['enable']
        },
        _clean_price: {
          oneof: ['clean_price']
        },
        _product_type: {
          oneof: ['product_type']
        }
      },
      fields: {
        opposite_price_notification_id: {
          type: 'string',
          id: 1
        },
        bond_key_market: {
          type: 'string',
          id: 2
        },
        broker_id: {
          type: 'string',
          id: 3
        },
        quote_id: {
          type: 'string',
          id: 4
        },
        trader_id: {
          type: 'string',
          id: 5
        },
        inst_name: {
          type: 'string',
          id: 6
        },
        trader_name: {
          type: 'string',
          id: 7
        },
        quote_side: {
          type: 'SideEnum',
          id: 8
        },
        quote_price: {
          type: 'double',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        quote_type: {
          type: 'BondQuoteTypeEnum',
          id: 10
        },
        flag_rebate: {
          type: 'bool',
          id: 11
        },
        flag_intention: {
          type: 'bool',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        flag_internal: {
          type: 'bool',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        flag_urgent: {
          type: 'bool',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        flag_exchange: {
          type: 'bool',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        flag_star: {
          type: 'int32',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        flag_oco: {
          type: 'bool',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        flag_package: {
          type: 'bool',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        flag_recommend: {
          type: 'bool',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        flag_indivisible: {
          type: 'bool',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        flag_stock_exchange: {
          type: 'bool',
          id: 21,
          options: {
            proto3_optional: true
          }
        },
        flag_bilateral: {
          type: 'bool',
          id: 22,
          options: {
            proto3_optional: true
          }
        },
        flag_request: {
          type: 'bool',
          id: 23,
          options: {
            proto3_optional: true
          }
        },
        comment: {
          type: 'string',
          id: 24,
          options: {
            proto3_optional: true
          }
        },
        return_point: {
          type: 'double',
          id: 25,
          options: {
            proto3_optional: true
          }
        },
        volume: {
          type: 'double',
          id: 26,
          options: {
            proto3_optional: true
          }
        },
        liquidation_speed: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 27
        },
        notification_msg: {
          type: 'string',
          id: 28
        },
        is_read: {
          type: 'bool',
          id: 29
        },
        send_status: {
          type: 'ImMsgSendStatusEnum',
          id: 30
        },
        send_failed_reason: {
          type: 'string',
          id: 31,
          options: {
            proto3_optional: true
          }
        },
        update_time: {
          type: 'string',
          id: 32
        },
        notify_color: {
          type: 'OppositePriceNotifyColorEnum',
          id: 33
        },
        trader_tag: {
          type: 'string',
          id: 34,
          options: {
            proto3_optional: true
          }
        },
        inst_id: {
          type: 'string',
          id: 35
        },
        enable: {
          type: 'EnableEnum',
          id: 36,
          options: {
            proto3_optional: true
          }
        },
        notify_logic_ids: {
          rule: 'repeated',
          type: 'string',
          id: 37
        },
        clean_price: {
          type: 'double',
          id: 38,
          options: {
            proto3_optional: true
          }
        },
        notification_content: {
          rule: 'repeated',
          type: 'NotificationContentStruct',
          id: 39
        },
        product_type: {
          type: 'ProductTypeEnum',
          id: 40,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    NotificationContentStruct: {
      fields: {
        notify_logic_type: {
          type: 'OppositePriceNotifyLogicTypeEnum',
          id: 1
        },
        notify_logic_id: {
          type: 'string',
          id: 2
        },
        notification_msg: {
          type: 'string',
          id: 3
        },
        price_msg: {
          type: 'string',
          id: 4
        },
        notify_logic_name: {
          type: 'string',
          id: 5
        }
      }
    },
    OppositePriceNotificationSettingStruct: {
      fields: {
        broker_id: {
          type: 'string',
          id: 1
        },
        notify_logic: {
          rule: 'repeated',
          type: 'OppositePriceNotifyLogicStruct',
          id: 2
        },
        msg_fill_type: {
          type: 'OppositePriceNotifyMsgFillTypeEnum',
          id: 3
        },
        bond_filter_logic: {
          type: 'OppositePriceBondFilterStruct',
          id: 4
        },
        flag_valuation_for_cp_handicap: {
          type: 'bool',
          id: 5
        },
        flag_issue_amount_for_cp_handicap: {
          type: 'bool',
          id: 6
        },
        flag_maturity_date_for_cp_handicap: {
          type: 'bool',
          id: 7
        },
        merge_msg_for_batch: {
          type: 'bool',
          id: 8
        },
        display_limit: {
          type: 'int32',
          id: 9
        }
      }
    },
    OppositePriceNotifyLogicStruct: {
      oneofs: {
        _n_value: {
          oneof: ['n_value']
        }
      },
      fields: {
        notify_logic_type: {
          type: 'OppositePriceNotifyLogicTypeEnum',
          id: 1
        },
        n_value: {
          type: 'double',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        color: {
          type: 'OppositePriceNotifyColorEnum',
          id: 3
        },
        turn_on: {
          type: 'bool',
          id: 4
        },
        msg_template: {
          type: 'string',
          id: 5
        },
        copied: {
          type: 'bool',
          id: 6
        },
        notify_logic_name: {
          type: 'string',
          id: 7
        },
        notify_logic_id: {
          type: 'string',
          id: 8
        }
      }
    },
    OppositePriceBondFilterStruct: {
      oneofs: {
        _maturity_is_holiday: {
          oneof: ['maturity_is_holiday']
        }
      },
      fields: {
        bond_category_list: {
          rule: 'repeated',
          type: 'BondCategoryEnum',
          id: 1
        },
        listed_market_list: {
          rule: 'repeated',
          type: 'ListedMarketEnum',
          id: 2
        },
        remain_days_list: {
          rule: 'repeated',
          type: 'RangeIntegerStruct',
          id: 3
        },
        bond_shortname_list: {
          rule: 'repeated',
          type: 'BondShortNameEnum',
          id: 4
        },
        fr_type_list: {
          rule: 'repeated',
          type: 'FRTypeEnum',
          id: 5
        },
        maturity_is_holiday: {
          type: 'bool',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        bond_nature_list: {
          rule: 'repeated',
          type: 'BondNatureEnum',
          id: 7
        }
      }
    },
    SendQQMsgWsStruct: {
      fields: {
        msg_list: {
          rule: 'repeated',
          type: 'SendQQMsgWsItemStruct',
          id: 1
        }
      }
    },
    SendQQMsgWsItemStruct: {
      fields: {
        msg_id: {
          type: 'string',
          id: 1
        },
        send_qq: {
          type: 'string',
          id: 2
        },
        recv_qq: {
          type: 'string',
          id: 3
        },
        msg: {
          type: 'string',
          id: 4
        },
        create_time: {
          type: 'string',
          id: 5
        }
      }
    },
    QuoteDraftFailedStruct: {
      fields: {
        index: {
          type: 'int32',
          id: 1
        },
        failed_type: {
          type: 'QuoteRelatedInfoFailedTypeEnum',
          id: 2
        }
      }
    },
    ReceiptDealDetailStruct: {
      oneofs: {
        _bridge_struct: {
          oneof: ['bridge_struct']
        },
        _diff_settlement_type: {
          oneof: ['diff_settlement_type']
        },
        _pending_side: {
          oneof: ['pending_side']
        }
      },
      fields: {
        parent_deal: {
          type: 'ReceiptDealStruct',
          id: 1
        },
        details: {
          rule: 'repeated',
          type: 'ReceiptDealStruct',
          id: 2
        },
        bridge_struct: {
          type: 'ReceiptDealDetailBridgeStruct',
          id: 3,
          options: {
            deprecated: true,
            proto3_optional: true
          }
        },
        diff_settlement_type: {
          type: 'int32',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        pending_side: {
          type: 'int32',
          id: 5,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    ReceiptDealApprovalStruct: {
      oneofs: {
        _bridge_code: {
          oneof: ['bridge_code']
        },
        _bid_inst: {
          oneof: ['bid_inst']
        },
        _bid_trader: {
          oneof: ['bid_trader']
        },
        _ofr_inst: {
          oneof: ['ofr_inst']
        },
        _ofr_trader: {
          oneof: ['ofr_trader']
        }
      },
      fields: {
        parent_deal_id: {
          type: 'string',
          id: 1
        },
        bridge_code: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        bid_inst: {
          type: 'InstitutionTinyStruct',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        bid_trader: {
          type: 'TraderStruct',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        ofr_inst: {
          type: 'InstitutionTinyStruct',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        ofr_trader: {
          type: 'TraderStruct',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        deal_list: {
          rule: 'repeated',
          type: 'ReceiptDealStruct',
          id: 7
        }
      }
    },
    ReceiptDealStruct: {
      oneofs: {
        _parent_deal_id: {
          oneof: ['parent_deal_id']
        },
        _bridge_index: {
          oneof: ['bridge_index']
        },
        _bid_broker_confirmed_time: {
          oneof: ['bid_broker_confirmed_time']
        },
        _ofr_broker_confirmed_time: {
          oneof: ['ofr_broker_confirmed_time']
        },
        _seq_number: {
          oneof: ['seq_number']
        },
        _order_no: {
          oneof: ['order_no']
        },
        _internal_code: {
          oneof: ['internal_code']
        },
        _bridge_code: {
          oneof: ['bridge_code']
        },
        _deal_time: {
          oneof: ['deal_time']
        },
        _deal_market_type: {
          oneof: ['deal_market_type']
        },
        _price: {
          oneof: ['price']
        },
        _yield: {
          oneof: ['yield']
        },
        _clean_price: {
          oneof: ['clean_price']
        },
        _full_price: {
          oneof: ['full_price']
        },
        _volume: {
          oneof: ['volume']
        },
        _spread: {
          oneof: ['spread']
        },
        _return_point: {
          oneof: ['return_point']
        },
        _settlement_amount: {
          oneof: ['settlement_amount']
        },
        _operator: {
          oneof: ['operator']
        },
        _flag_need_bridge: {
          oneof: ['flag_need_bridge']
        },
        _destroy_reason: {
          oneof: ['destroy_reason']
        },
        _source: {
          oneof: ['source']
        },
        _disapproval_snapshot: {
          oneof: ['disapproval_snapshot']
        },
        _cur_approval_role: {
          oneof: ['cur_approval_role']
        },
        _cur_role_is_normal: {
          oneof: ['cur_role_is_normal']
        },
        _advanced_role_num: {
          oneof: ['advanced_role_num']
        },
        _disapproval_reason: {
          oneof: ['disapproval_reason']
        },
        _sync_version: {
          oneof: ['sync_version']
        },
        _bid_send_order_info: {
          oneof: ['bid_send_order_info']
        },
        _ofr_send_order_info: {
          oneof: ['ofr_send_order_info']
        },
        _flag_stock_exchange: {
          oneof: ['flag_stock_exchange']
        },
        _add_bridge_operator: {
          oneof: ['add_bridge_operator']
        },
        _flag_history_pass: {
          oneof: ['flag_history_pass']
        },
        _generate_data_source: {
          oneof: ['generate_data_source']
        },
        _bid_real_receipt_deal_id: {
          oneof: ['bid_real_receipt_deal_id']
        },
        _ofr_real_receipt_deal_id: {
          oneof: ['ofr_real_receipt_deal_id']
        },
        _channel: {
          oneof: ['channel']
        },
        _send_msg: {
          oneof: ['send_msg']
        },
        _send_msg_comment: {
          oneof: ['send_msg_comment']
        },
        _hide_comment: {
          oneof: ['hide_comment']
        },
        _fee: {
          oneof: ['fee']
        },
        _bid_biller_id: {
          oneof: ['bid_biller_id']
        },
        _ofr_biller_id: {
          oneof: ['ofr_biller_id']
        },
        _bid_biller_tag: {
          oneof: ['bid_biller_tag']
        },
        _ofr_biller_tag: {
          oneof: ['ofr_biller_tag']
        },
        _bid_biller_name: {
          oneof: ['bid_biller_name']
        },
        _ofr_biller_name: {
          oneof: ['ofr_biller_name']
        },
        _bridge_comment: {
          oneof: ['bridge_comment']
        },
        _bid_contact: {
          oneof: ['bid_contact']
        },
        _ofr_contact: {
          oneof: ['ofr_contact']
        },
        _bridge_direction: {
          oneof: ['bridge_direction']
        },
        _flag_bridge_info_changed: {
          oneof: ['flag_bridge_info_changed']
        },
        _flag_change_after_sor_execution: {
          oneof: ['flag_change_after_sor_execution']
        },
        _deal_sor_send_status: {
          oneof: ['deal_sor_send_status']
        }
      },
      fields: {
        bond_basic_info: {
          type: 'FiccBondBasicStruct',
          id: 1
        },
        receipt_deal_id: {
          type: 'string',
          id: 2
        },
        parent_deal_id: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        bridge_index: {
          type: 'int32',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        receipt_deal_status: {
          type: 'ReceiptDealStatusEnum',
          id: 5
        },
        flag_bid_broker_confirmed: {
          type: 'bool',
          id: 6
        },
        bid_broker_confirmed_time: {
          type: 'string',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        flag_ofr_broker_confirmed: {
          type: 'bool',
          id: 8
        },
        ofr_broker_confirmed_time: {
          type: 'string',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        create_time: {
          type: 'string',
          id: 10
        },
        update_time: {
          type: 'string',
          id: 11
        },
        direction: {
          type: 'DirectionEnum',
          id: 12
        },
        seq_number: {
          type: 'string',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        order_no: {
          type: 'string',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        internal_code: {
          type: 'string',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        bridge_code: {
          type: 'string',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        deal_time: {
          type: 'string',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        deal_market_type: {
          type: 'DealMarketTypeEnum',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        flag_internal: {
          type: 'bool',
          id: 19
        },
        flag_send_market: {
          type: 'bool',
          id: 20
        },
        flag_urgent: {
          type: 'bool',
          id: 21
        },
        price: {
          type: 'double',
          id: 22,
          options: {
            proto3_optional: true
          }
        },
        yield: {
          type: 'double',
          id: 23,
          options: {
            proto3_optional: true
          }
        },
        clean_price: {
          type: 'double',
          id: 24,
          options: {
            proto3_optional: true
          }
        },
        full_price: {
          type: 'double',
          id: 25,
          options: {
            proto3_optional: true
          }
        },
        volume: {
          type: 'double',
          id: 26,
          options: {
            proto3_optional: true
          }
        },
        spread: {
          type: 'double',
          id: 27,
          options: {
            proto3_optional: true
          }
        },
        return_point: {
          type: 'double',
          id: 28,
          options: {
            proto3_optional: true
          }
        },
        settlement_amount: {
          type: 'double',
          id: 29,
          options: {
            proto3_optional: true
          }
        },
        settlement_mode: {
          type: 'SettlementModeEnum',
          id: 30
        },
        flag_rebate: {
          type: 'bool',
          id: 31
        },
        is_exercise: {
          type: 'ExerciseTypeEnum',
          id: 32
        },
        liquidation_speed_list: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 33
        },
        traded_date: {
          type: 'string',
          id: 34
        },
        delivery_date: {
          type: 'string',
          id: 35
        },
        bid_trade_info: {
          type: 'ReceiptDealTradeStruct',
          id: 36
        },
        ofr_trade_info: {
          type: 'ReceiptDealTradeStruct',
          id: 37
        },
        other_detail: {
          type: 'string',
          id: 38
        },
        backend_msg: {
          type: 'string',
          id: 39
        },
        backend_feed_back: {
          type: 'string',
          id: 40
        },
        operator: {
          type: 'UserStruct',
          id: 41,
          options: {
            proto3_optional: true
          }
        },
        price_type: {
          type: 'BondQuoteTypeEnum',
          id: 42
        },
        flag_need_bridge: {
          type: 'bool',
          id: 43,
          options: {
            proto3_optional: true
          }
        },
        destroy_reason: {
          type: 'string',
          id: 44,
          options: {
            proto3_optional: true
          }
        },
        source: {
          type: 'OperationSourceEnum',
          id: 45,
          options: {
            proto3_optional: true
          }
        },
        all_approver_id_list: {
          rule: 'repeated',
          type: 'string',
          id: 46
        },
        matched_advanced_rule_id_list: {
          rule: 'repeated',
          type: 'string',
          id: 47
        },
        disapproval_snapshot: {
          type: 'ReceiptDealStruct',
          id: 48,
          options: {
            proto3_optional: true
          }
        },
        advanced_approval_type: {
          rule: 'repeated',
          type: 'AdvancedApprovalTypeEnum',
          id: 49
        },
        cur_approval_role: {
          type: 'string',
          id: 50,
          options: {
            proto3_optional: true
          }
        },
        cur_role_is_normal: {
          type: 'bool',
          id: 51,
          options: {
            proto3_optional: true
          }
        },
        advanced_role_num: {
          type: 'int32',
          id: 52,
          options: {
            proto3_optional: true
          }
        },
        disapproval_reason: {
          type: 'string',
          id: 53,
          options: {
            proto3_optional: true
          }
        },
        sync_version: {
          type: 'string',
          id: 54,
          options: {
            proto3_optional: true
          }
        },
        all_approval_role_list: {
          rule: 'repeated',
          type: 'string',
          id: 55
        },
        sub_rule_name_list: {
          rule: 'repeated',
          type: 'string',
          id: 56
        },
        bid_send_order_info: {
          type: 'string',
          id: 57,
          options: {
            proto3_optional: true
          }
        },
        ofr_send_order_info: {
          type: 'string',
          id: 58,
          options: {
            proto3_optional: true
          }
        },
        flag_stock_exchange: {
          type: 'bool',
          id: 59,
          options: {
            proto3_optional: true
          }
        },
        add_bridge_operator: {
          type: 'UserStruct',
          id: 60,
          options: {
            proto3_optional: true
          }
        },
        print_operator_list: {
          rule: 'repeated',
          type: 'UserStruct',
          id: 61
        },
        flag_history_pass: {
          type: 'bool',
          id: 62,
          options: {
            proto3_optional: true
          }
        },
        generate_data_source: {
          type: 'int32',
          id: 63,
          options: {
            proto3_optional: true
          }
        },
        bid_real_receipt_deal_id: {
          type: 'string',
          id: 64,
          options: {
            proto3_optional: true
          }
        },
        ofr_real_receipt_deal_id: {
          type: 'string',
          id: 65,
          options: {
            proto3_optional: true
          }
        },
        channel: {
          type: 'BridgeChannelEnum',
          id: 68,
          options: {
            proto3_optional: true
          }
        },
        send_msg: {
          type: 'string',
          id: 69,
          options: {
            proto3_optional: true
          }
        },
        send_msg_comment: {
          type: 'string',
          id: 70,
          options: {
            proto3_optional: true
          }
        },
        hide_comment: {
          type: 'bool',
          id: 71,
          options: {
            proto3_optional: true
          }
        },
        fee: {
          type: 'double',
          id: 72,
          options: {
            proto3_optional: true
          }
        },
        send_order_inst_list: {
          rule: 'repeated',
          type: 'SendOrderInstStruct',
          id: 73
        },
        bid_biller_id: {
          type: 'string',
          id: 74,
          options: {
            proto3_optional: true
          }
        },
        ofr_biller_id: {
          type: 'string',
          id: 75,
          options: {
            proto3_optional: true
          }
        },
        bid_biller_tag: {
          type: 'string',
          id: 76,
          options: {
            proto3_optional: true
          }
        },
        ofr_biller_tag: {
          type: 'string',
          id: 77,
          options: {
            proto3_optional: true
          }
        },
        bid_biller_name: {
          type: 'string',
          id: 78,
          options: {
            proto3_optional: true
          }
        },
        ofr_biller_name: {
          type: 'string',
          id: 79,
          options: {
            proto3_optional: true
          }
        },
        bridge_comment: {
          type: 'string',
          id: 80,
          options: {
            proto3_optional: true
          }
        },
        bid_contact: {
          type: 'string',
          id: 81,
          options: {
            proto3_optional: true
          }
        },
        ofr_contact: {
          type: 'string',
          id: 82,
          options: {
            proto3_optional: true
          }
        },
        bridge_direction: {
          type: 'BridgeDirectionEnum',
          id: 83,
          options: {
            proto3_optional: true
          }
        },
        flag_bridge_info_changed: {
          type: 'bool',
          id: 84,
          options: {
            proto3_optional: true
          }
        },
        flag_change_after_sor_execution: {
          type: 'bool',
          id: 85,
          options: {
            proto3_optional: true
          }
        },
        deal_sor_send_status: {
          type: 'DealSorSendStatusEnum',
          id: 86,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    ReceiptDealTradeStruct: {
      oneofs: {
        _inst: {
          oneof: ['inst']
        },
        _city: {
          oneof: ['city']
        },
        _trader: {
          oneof: ['trader']
        },
        _brokerage: {
          oneof: ['brokerage']
        },
        _brokerage_type: {
          oneof: ['brokerage_type']
        },
        _trade_mode: {
          oneof: ['trade_mode']
        },
        _broker: {
          oneof: ['broker']
        },
        _broker_b: {
          oneof: ['broker_b']
        },
        _broker_c: {
          oneof: ['broker_c']
        },
        _broker_d: {
          oneof: ['broker_d']
        },
        _broker_percent: {
          oneof: ['broker_percent']
        },
        _broker_percent_b: {
          oneof: ['broker_percent_b']
        },
        _broker_percent_c: {
          oneof: ['broker_percent_c']
        },
        _broker_percent_d: {
          oneof: ['broker_percent_d']
        },
        _flag_bridge: {
          oneof: ['flag_bridge']
        },
        _flag_nc: {
          oneof: ['flag_nc']
        },
        _nc: {
          oneof: ['nc']
        },
        _pay_for_info: {
          oneof: ['pay_for_info']
        },
        _inst_brokerage_comment: {
          oneof: ['inst_brokerage_comment']
        },
        _inst_special: {
          oneof: ['inst_special']
        },
        _flag_in_bridge_inst_list: {
          oneof: ['flag_in_bridge_inst_list']
        },
        _trader_tag: {
          oneof: ['trader_tag']
        },
        _flag_pay_for_inst: {
          oneof: ['flag_pay_for_inst']
        }
      },
      fields: {
        inst: {
          type: 'InstitutionTinyStruct',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        city: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        trader: {
          type: 'TraderStruct',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        brokerage: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        brokerage_type: {
          type: 'BrokerageTypeEnum',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        trade_mode: {
          type: 'TradeModeEnum',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        broker: {
          type: 'UserStruct',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        broker_b: {
          type: 'UserStruct',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        broker_c: {
          type: 'UserStruct',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        broker_d: {
          type: 'UserStruct',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        broker_percent: {
          type: 'int32',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        broker_percent_b: {
          type: 'int32',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        broker_percent_c: {
          type: 'int32',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        broker_percent_d: {
          type: 'int32',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        flag_bridge: {
          type: 'bool',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        flag_nc: {
          type: 'bool',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        nc: {
          type: 'string',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        pay_for_info: {
          type: 'ReceiptDealPayForStruct',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        inst_brokerage_comment: {
          type: 'ReceiptDealTradeInstBrokerageCommentEnum',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        inst_special: {
          type: 'string',
          id: 21,
          options: {
            proto3_optional: true
          }
        },
        flag_in_bridge_inst_list: {
          type: 'bool',
          id: 22,
          options: {
            proto3_optional: true
          }
        },
        trader_tag: {
          type: 'string',
          id: 23,
          options: {
            proto3_optional: true
          }
        },
        flag_pay_for_inst: {
          type: 'bool',
          id: 24,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    ReceiptDealDetailBridgeStruct: {
      oneofs: {
        _bridge_bid_channel: {
          oneof: ['bridge_bid_channel']
        },
        _bridge_ofr_channel: {
          oneof: ['bridge_ofr_channel']
        },
        _bid_send_msg: {
          oneof: ['bid_send_msg']
        },
        _ofr_send_msg: {
          oneof: ['ofr_send_msg']
        },
        _bid_send_msg_comment: {
          oneof: ['bid_send_msg_comment']
        },
        _ofr_send_msg_comment: {
          oneof: ['ofr_send_msg_comment']
        },
        _bid_hide_comment: {
          oneof: ['bid_hide_comment']
        },
        _ofr_hide_comment: {
          oneof: ['ofr_hide_comment']
        },
        _bid_biller_id: {
          oneof: ['bid_biller_id']
        },
        _ofr_biller_id: {
          oneof: ['ofr_biller_id']
        },
        _bid_bridge_comment: {
          oneof: ['bid_bridge_comment']
        },
        _ofr_bridge_comment: {
          oneof: ['ofr_bridge_comment']
        },
        _double_bridge_send_msg: {
          oneof: ['double_bridge_send_msg']
        },
        _bid_biller_tag: {
          oneof: ['bid_biller_tag']
        },
        _ofr_biller_tag: {
          oneof: ['ofr_biller_tag']
        },
        _bid_contact: {
          oneof: ['bid_contact']
        },
        _ofr_contact: {
          oneof: ['ofr_contact']
        },
        _double_bridge_pay: {
          oneof: ['double_bridge_pay']
        },
        _double_bridge_send_comment: {
          oneof: ['double_bridge_send_comment']
        },
        _double_bridge_send_channel: {
          oneof: ['double_bridge_send_channel']
        },
        _bid_bridge_direction: {
          oneof: ['bid_bridge_direction']
        },
        _ofr_bridge_direction: {
          oneof: ['ofr_bridge_direction']
        },
        _double_bridge_direction: {
          oneof: ['double_bridge_direction']
        },
        _flag_double_bridge_is_pending: {
          oneof: ['flag_double_bridge_is_pending']
        },
        _stagger_date: {
          oneof: ['stagger_date']
        },
        _bid_contact_id: {
          oneof: ['bid_contact_id']
        },
        _bid_contact_tag: {
          oneof: ['bid_contact_tag']
        },
        _ofr_contact_id: {
          oneof: ['ofr_contact_id']
        },
        _ofr_contact_tag: {
          oneof: ['ofr_contact_tag']
        },
        _bid_contact_name: {
          oneof: ['bid_contact_name']
        },
        _ofr_contact_name: {
          oneof: ['ofr_contact_name']
        },
        _bid_biller_name: {
          oneof: ['bid_biller_name']
        },
        _ofr_biller_name: {
          oneof: ['ofr_biller_name']
        },
        _bid_send_pay: {
          oneof: ['bid_send_pay']
        },
        _ofr_send_pay: {
          oneof: ['ofr_send_pay']
        },
        _pending_side: {
          oneof: ['pending_side']
        },
        _flag_bid_bridge_info_changed: {
          oneof: ['flag_bid_bridge_info_changed']
        },
        _flag_ofr_bridge_info_changed: {
          oneof: ['flag_ofr_bridge_info_changed']
        }
      },
      fields: {
        bridge_bid_channel: {
          type: 'BridgeChannelEnum',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        bridge_ofr_channel: {
          type: 'BridgeChannelEnum',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        bid_send_msg: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        ofr_send_msg: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        bid_send_msg_comment: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        ofr_send_msg_comment: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        bid_hide_comment: {
          type: 'bool',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        ofr_hide_comment: {
          type: 'bool',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        bid_send_order_inst_list: {
          rule: 'repeated',
          type: 'SendOrderInstStruct',
          id: 9
        },
        ofr_send_order_inst_list: {
          rule: 'repeated',
          type: 'SendOrderInstStruct',
          id: 10
        },
        bid_send_settlement_type: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 11
        },
        ofr_send_settlement_type: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 12
        },
        bid_biller_id: {
          type: 'string',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        ofr_biller_id: {
          type: 'string',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        bid_bridge_comment: {
          type: 'string',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        ofr_bridge_comment: {
          type: 'string',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        double_bridge_send_msg: {
          type: 'string',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        bid_biller_tag: {
          type: 'string',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        ofr_biller_tag: {
          type: 'string',
          id: 21,
          options: {
            proto3_optional: true
          }
        },
        bid_contact: {
          type: 'string',
          id: 22,
          options: {
            proto3_optional: true
          }
        },
        ofr_contact: {
          type: 'string',
          id: 23,
          options: {
            proto3_optional: true
          }
        },
        double_bridge_pay: {
          type: 'double',
          id: 24,
          options: {
            proto3_optional: true
          }
        },
        double_bridge_send_comment: {
          type: 'string',
          id: 25,
          options: {
            proto3_optional: true
          }
        },
        double_bridge_send_channel: {
          type: 'BridgeChannelEnum',
          id: 26,
          options: {
            proto3_optional: true
          }
        },
        bid_bridge_direction: {
          type: 'BridgeDirectionEnum',
          id: 27,
          options: {
            proto3_optional: true
          }
        },
        ofr_bridge_direction: {
          type: 'BridgeDirectionEnum',
          id: 28,
          options: {
            proto3_optional: true
          }
        },
        double_bridge_direction: {
          type: 'DoubleBridgeDirectionEnum',
          id: 29,
          options: {
            proto3_optional: true
          }
        },
        flag_double_bridge_is_pending: {
          type: 'bool',
          id: 30,
          options: {
            proto3_optional: true
          }
        },
        stagger_date: {
          type: 'int32',
          id: 31,
          options: {
            proto3_optional: true
          }
        },
        bid_contact_id: {
          type: 'string',
          id: 32,
          options: {
            proto3_optional: true
          }
        },
        bid_contact_tag: {
          type: 'string',
          id: 33,
          options: {
            proto3_optional: true
          }
        },
        ofr_contact_id: {
          type: 'string',
          id: 34,
          options: {
            proto3_optional: true
          }
        },
        ofr_contact_tag: {
          type: 'string',
          id: 35,
          options: {
            proto3_optional: true
          }
        },
        bid_contact_name: {
          type: 'string',
          id: 36,
          options: {
            proto3_optional: true
          }
        },
        ofr_contact_name: {
          type: 'string',
          id: 37,
          options: {
            proto3_optional: true
          }
        },
        bid_biller_name: {
          type: 'string',
          id: 38,
          options: {
            proto3_optional: true
          }
        },
        ofr_biller_name: {
          type: 'string',
          id: 39,
          options: {
            proto3_optional: true
          }
        },
        bid_send_pay: {
          type: 'double',
          id: 40,
          options: {
            proto3_optional: true
          }
        },
        ofr_send_pay: {
          type: 'double',
          id: 41,
          options: {
            proto3_optional: true
          }
        },
        pending_side: {
          type: 'int32',
          id: 42,
          options: {
            proto3_optional: true
          }
        },
        flag_bid_bridge_info_changed: {
          type: 'bool',
          id: 43,
          options: {
            proto3_optional: true
          }
        },
        flag_ofr_bridge_info_changed: {
          type: 'bool',
          id: 44,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    ReceiptDealTradeOpStruct: {
      oneofs: {
        _inst_id: {
          oneof: ['inst_id']
        },
        _city: {
          oneof: ['city']
        },
        _trader_id: {
          oneof: ['trader_id']
        },
        _trader_tag: {
          oneof: ['trader_tag']
        },
        _brokerage: {
          oneof: ['brokerage']
        },
        _brokerage_type: {
          oneof: ['brokerage_type']
        },
        _trade_mode: {
          oneof: ['trade_mode']
        },
        _broker_id: {
          oneof: ['broker_id']
        },
        _broker_id_b: {
          oneof: ['broker_id_b']
        },
        _broker_id_c: {
          oneof: ['broker_id_c']
        },
        _broker_id_d: {
          oneof: ['broker_id_d']
        },
        _broker_percent: {
          oneof: ['broker_percent']
        },
        _broker_percent_b: {
          oneof: ['broker_percent_b']
        },
        _broker_percent_c: {
          oneof: ['broker_percent_c']
        },
        _broker_percent_d: {
          oneof: ['broker_percent_d']
        },
        _nc: {
          oneof: ['nc']
        },
        _pay_for_info: {
          oneof: ['pay_for_info']
        },
        _inst_brokerage_comment: {
          oneof: ['inst_brokerage_comment']
        },
        _inst_special: {
          oneof: ['inst_special']
        },
        _flag_pay_for_inst: {
          oneof: ['flag_pay_for_inst']
        },
        _traded_date: {
          oneof: ['traded_date']
        },
        _delivery_date: {
          oneof: ['delivery_date']
        }
      },
      fields: {
        inst_id: {
          type: 'string',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        city: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        trader_id: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        trader_tag: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        brokerage: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        brokerage_type: {
          type: 'BrokerageTypeEnum',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        trade_mode: {
          type: 'TradeModeEnum',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        broker_id: {
          type: 'string',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        broker_id_b: {
          type: 'string',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        broker_id_c: {
          type: 'string',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        broker_id_d: {
          type: 'string',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        broker_percent: {
          type: 'int32',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        broker_percent_b: {
          type: 'int32',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        broker_percent_c: {
          type: 'int32',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        broker_percent_d: {
          type: 'int32',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        flag_bridge: {
          type: 'bool',
          id: 16
        },
        flag_nc: {
          type: 'bool',
          id: 17
        },
        nc: {
          type: 'string',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        pay_for_info: {
          type: 'ReceiptDealPayForOpStruct',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        inst_brokerage_comment: {
          type: 'ReceiptDealTradeInstBrokerageCommentEnum',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        inst_special: {
          type: 'string',
          id: 21,
          options: {
            proto3_optional: true
          }
        },
        flag_pay_for_inst: {
          type: 'bool',
          id: 22,
          options: {
            proto3_optional: true
          }
        },
        traded_date: {
          type: 'string',
          id: 23,
          options: {
            proto3_optional: true
          }
        },
        delivery_date: {
          type: 'string',
          id: 24,
          options: {
            proto3_optional: true
          }
        },
        liquidation_speed_list: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 25
        }
      }
    },
    SendOrderInstStruct: {
      fields: {
        inst: {
          type: 'InstitutionTinyStruct',
          id: 1
        },
        volume: {
          type: 'double',
          id: 2
        }
      }
    },
    ReceiptDealPayForStruct: {
      oneofs: {
        _pay_for_inst: {
          oneof: ['pay_for_inst']
        },
        _pay_for_city: {
          oneof: ['pay_for_city']
        },
        _pay_for_trader: {
          oneof: ['pay_for_trader']
        },
        _flag_pay_for_nc: {
          oneof: ['flag_pay_for_nc']
        },
        _pay_for_nc: {
          oneof: ['pay_for_nc']
        }
      },
      fields: {
        flag_pay_for: {
          type: 'bool',
          id: 1
        },
        pay_for_inst: {
          type: 'InstitutionTinyStruct',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        pay_for_city: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        pay_for_trader: {
          type: 'TraderStruct',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        flag_pay_for_nc: {
          type: 'bool',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        pay_for_nc: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    ReceiptDealPayForOpStruct: {
      oneofs: {
        _flag_pay_for: {
          oneof: ['flag_pay_for']
        },
        _pay_for_inst_id: {
          oneof: ['pay_for_inst_id']
        },
        _pay_for_city: {
          oneof: ['pay_for_city']
        },
        _pay_for_trader_id: {
          oneof: ['pay_for_trader_id']
        },
        _pay_for_trader_tag: {
          oneof: ['pay_for_trader_tag']
        },
        _flag_pay_for_nc: {
          oneof: ['flag_pay_for_nc']
        },
        _pay_for_nc: {
          oneof: ['pay_for_nc']
        }
      },
      fields: {
        flag_pay_for: {
          type: 'bool',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        pay_for_inst_id: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        pay_for_city: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        pay_for_trader_id: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        pay_for_trader_tag: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        flag_pay_for_nc: {
          type: 'bool',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        pay_for_nc: {
          type: 'string',
          id: 7,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    ReceiptDealBridgeStruct: {
      oneofs: {
        _inst: {
          oneof: ['inst']
        },
        _city: {
          oneof: ['city']
        },
        _trader: {
          oneof: ['trader']
        },
        _broker: {
          oneof: ['broker']
        }
      },
      fields: {
        inst: {
          type: 'InstitutionTinyStruct',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        city: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        trader: {
          type: 'TraderStruct',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        broker: {
          type: 'UserStruct',
          id: 4,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    ReceiptDealBridgeOpStruct: {
      oneofs: {
        _city: {
          oneof: ['city']
        },
        _trader_tag: {
          oneof: ['trader_tag']
        }
      },
      fields: {
        inst_id: {
          type: 'string',
          id: 1
        },
        city: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        trader_id: {
          type: 'string',
          id: 3
        },
        trader_tag: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        broker_id: {
          type: 'string',
          id: 5
        }
      }
    },
    ReceiptDealOperationLogStruct: {
      oneofs: {
        _operator: {
          oneof: ['operator']
        },
        _before_receipt_deal_snapshot: {
          oneof: ['before_receipt_deal_snapshot']
        },
        _after_receipt_deal_snapshot: {
          oneof: ['after_receipt_deal_snapshot']
        },
        _code_market: {
          oneof: ['code_market']
        },
        _key_market: {
          oneof: ['key_market']
        }
      },
      fields: {
        log_id: {
          type: 'string',
          id: 1
        },
        deal_id: {
          type: 'string',
          id: 2
        },
        operator: {
          type: 'UserStruct',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        operation_type: {
          type: 'ReceiptDealOperationTypeEnum',
          id: 4
        },
        before_receipt_deal_snapshot: {
          type: 'ReceiptDealStruct',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        after_receipt_deal_snapshot: {
          type: 'ReceiptDealStruct',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        update_types: {
          rule: 'repeated',
          type: 'ReceiptDealUpdateTypeItemStruct',
          id: 7
        },
        create_time: {
          type: 'string',
          id: 8
        },
        operation_source: {
          type: 'OperationSourceEnum',
          id: 9
        },
        code_market: {
          type: 'string',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        key_market: {
          type: 'string',
          id: 11,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    ReceiptDealUpdateTypeItemStruct: {
      oneofs: {
        _update_field_comment: {
          oneof: ['update_field_comment']
        }
      },
      fields: {
        update_type: {
          type: 'ReceiptDealUpdateTypeEnum',
          id: 1
        },
        update_field_comment: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    DealOperationInfo: {
      fields: {
        operator: {
          type: 'string',
          id: 1
        },
        operation_type: {
          type: 'DealOperationTypeEnum',
          id: 2
        },
        operation_source: {
          type: 'OperationSourceEnum',
          id: 3
        }
      }
    },
    ReceiptDealApprovalRole: {
      fields: {
        approval_role_id: {
          type: 'string',
          id: 1
        },
        approval_role_name: {
          type: 'string',
          id: 2
        },
        approval_role_level: {
          type: 'int32',
          id: 3
        },
        role_member_list: {
          rule: 'repeated',
          type: 'ReceiptDealRoleMember',
          id: 4
        },
        product_type: {
          type: 'ProductTypeEnum',
          id: 5
        }
      }
    },
    ReceiptDealRoleMember: {
      fields: {
        member_id: {
          type: 'string',
          id: 1
        },
        member_name: {
          type: 'string',
          id: 2
        }
      }
    },
    ReceiptDealApprovalRule: {
      oneofs: {
        _rule_subtype_name: {
          oneof: ['rule_subtype_name']
        }
      },
      fields: {
        approval_rule_id: {
          type: 'string',
          id: 1
        },
        rule_type: {
          type: 'ReceiptDealRuleTypeEnum',
          id: 2
        },
        is_active: {
          type: 'bool',
          id: 3
        },
        rule_name: {
          type: 'string',
          id: 4
        },
        rule_subtype: {
          rule: 'repeated',
          type: 'ReceiptDealRuleSubtypeEnum',
          id: 5
        },
        rule_subtype_name: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        advanced_role_list: {
          rule: 'repeated',
          type: 'ReceiptDealApprovalRole',
          id: 7
        },
        normal_role_list: {
          rule: 'repeated',
          type: 'ReceiptDealApprovalRole',
          id: 8
        },
        product_type: {
          type: 'ProductTypeEnum',
          id: 9
        }
      }
    },
    TableRelatedDealApprovalFilter: {
      oneofs: {
        _receipt_deal_order_no: {
          oneof: ['receipt_deal_order_no']
        },
        _bridge_code: {
          oneof: ['bridge_code']
        },
        _trader_id: {
          oneof: ['trader_id']
        },
        _trader_side: {
          oneof: ['trader_side']
        },
        _inst_id: {
          oneof: ['inst_id']
        },
        _inst_is_bridge_inst: {
          oneof: ['inst_is_bridge_inst']
        },
        _inst_side: {
          oneof: ['inst_side']
        },
        _bond_key: {
          oneof: ['bond_key']
        },
        _deal_price: {
          oneof: ['deal_price']
        },
        _volume: {
          oneof: ['volume']
        }
      },
      fields: {
        receipt_deal_order_no: {
          type: 'string',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        bridge_code: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        trader_id: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        trader_side: {
          type: 'SideEnum',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        inst_id: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        inst_is_bridge_inst: {
          type: 'bool',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        inst_side: {
          type: 'SideEnum',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        bond_key: {
          type: 'string',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        deal_price: {
          type: 'double',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        volume: {
          type: 'double',
          id: 10,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    ReceiptDealOperateIllegalStruct: {
      fields: {
        internal_code_list: {
          rule: 'repeated',
          type: 'string',
          id: 1
        },
        bridge_code_list: {
          rule: 'repeated',
          type: 'string',
          id: 2
        },
        check_bridge: {
          type: 'CheckBridgeEnum',
          id: 3
        },
        order_no_list: {
          rule: 'repeated',
          type: 'string',
          id: 4
        },
        seq_no_list: {
          rule: 'repeated',
          type: 'string',
          id: 5
        }
      }
    },
    InstWithTradersMinimalStruct: {
      fields: {
        inst_id: {
          type: 'string',
          id: 1
        },
        inst_name: {
          type: 'string',
          id: 2
        },
        traders: {
          rule: 'repeated',
          type: 'TraderMinimalStruct',
          id: 3
        }
      }
    },
    TraderMinimalStruct: {
      fields: {
        trader_id: {
          type: 'string',
          id: 1
        },
        trader_name: {
          type: 'string',
          id: 2
        }
      }
    },
    LocalServerWsClientMessage: {
      oneofs: {
        _request_id: {
          oneof: ['request_id']
        },
        _interval: {
          oneof: ['interval']
        },
        _request_type: {
          oneof: ['request_type']
        },
        _scene: {
          oneof: ['scene']
        },
        _request_params: {
          oneof: ['request_params']
        }
      },
      fields: {
        msg_type: {
          type: 'LocalServerWsMsgTypeEnum',
          id: 1
        },
        trace_parent: {
          type: 'string',
          id: 2
        },
        alive_request_id_list: {
          rule: 'repeated',
          type: 'string',
          id: 3
        },
        request_id: {
          type: 'string',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        interval: {
          type: 'int32',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        request_type: {
          type: 'LocalServerRequestTypeEnum',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        scene: {
          type: 'LocalServerRealtimeSceneEnum',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        request_params: {
          type: 'string',
          id: 8,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    LocalServerWsServerMessage: {
      oneofs: {
        _base_response: {
          oneof: ['base_response']
        },
        _data_is_ready: {
          oneof: ['data_is_ready']
        },
        _net_is_ready: {
          oneof: ['net_is_ready']
        },
        _request_id: {
          oneof: ['request_id']
        },
        _response_data: {
          oneof: ['response_data']
        }
      },
      fields: {
        msg_type: {
          type: 'LocalServerWsMsgTypeEnum',
          id: 1
        },
        base_response: {
          type: 'BaseResponseStruct',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        data_is_ready: {
          type: 'bool',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        net_is_ready: {
          type: 'bool',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        request_id: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        response_data: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    ApprovalSortingMethodStruct: {
      fields: {
        sorted_field: {
          type: 'ApprovalSortedFieldEnum',
          id: 1
        },
        is_desc: {
          type: 'bool',
          id: 2
        }
      }
    },
    SendOrderInstInfoStruct: {
      fields: {
        inst_id: {
          type: 'string',
          id: 1
        },
        volume: {
          type: 'float',
          id: 2
        }
      }
    },
    DealRecordStruct: {
      oneofs: {
        _flag_bridge: {
          oneof: ['flag_bridge']
        },
        _send_order_msg: {
          oneof: ['send_order_msg']
        },
        _bid_send_order_msg: {
          oneof: ['bid_send_order_msg']
        },
        _ofr_send_order_msg: {
          oneof: ['ofr_send_order_msg']
        },
        _bond_info: {
          oneof: ['bond_info']
        },
        _confirm_volume: {
          oneof: ['confirm_volume']
        },
        _price_type: {
          oneof: ['price_type']
        },
        _price: {
          oneof: ['price']
        },
        _yield: {
          oneof: ['yield']
        },
        _clean_price: {
          oneof: ['clean_price']
        },
        _full_price: {
          oneof: ['full_price']
        },
        _return_point: {
          oneof: ['return_point']
        },
        _bid_traded_date: {
          oneof: ['bid_traded_date']
        },
        _bid_delivery_date: {
          oneof: ['bid_delivery_date']
        },
        _ofr_traded_date: {
          oneof: ['ofr_traded_date']
        },
        _ofr_delivery_date: {
          oneof: ['ofr_delivery_date']
        },
        _bid_bridge_record_id: {
          oneof: ['bid_bridge_record_id']
        },
        _ofr_bridge_record_id: {
          oneof: ['ofr_bridge_record_id']
        },
        _flag_exchange: {
          oneof: ['flag_exchange']
        },
        _exercise_type: {
          oneof: ['exercise_type']
        },
        _deal_status: {
          oneof: ['deal_status']
        },
        _spot_pricinger: {
          oneof: ['spot_pricinger']
        },
        _spot_pricingee: {
          oneof: ['spot_pricingee']
        },
        _spot_pricing_record_id: {
          oneof: ['spot_pricing_record_id']
        },
        _flag_internal: {
          oneof: ['flag_internal']
        },
        _operator: {
          oneof: ['operator']
        },
        _listed_market: {
          oneof: ['listed_market']
        },
        _im_msg_text: {
          oneof: ['im_msg_text']
        },
        _im_msg_send_status: {
          oneof: ['im_msg_send_status']
        },
        _im_msg_record_id: {
          oneof: ['im_msg_record_id']
        },
        _quote_id: {
          oneof: ['quote_id']
        },
        _spot_pricing_volume: {
          oneof: ['spot_pricing_volume']
        },
        _remain_volume: {
          oneof: ['remain_volume']
        },
        _bid_old_content: {
          oneof: ['bid_old_content']
        },
        _ofr_old_content: {
          oneof: ['ofr_old_content']
        },
        _bid_deal_read_status: {
          oneof: ['bid_deal_read_status']
        },
        _ofr_deal_read_status: {
          oneof: ['ofr_deal_read_status']
        },
        _exercise_manual: {
          oneof: ['exercise_manual']
        },
        _hand_over_status: {
          oneof: ['hand_over_status']
        },
        _flag_reverse_sync: {
          oneof: ['flag_reverse_sync']
        },
        _flag_unrefer_quote: {
          oneof: ['flag_unrefer_quote']
        },
        _flag_deal_has_changed: {
          oneof: ['flag_deal_has_changed']
        },
        _bid_add_bridge_operator: {
          oneof: ['bid_add_bridge_operator']
        },
        _ofr_add_bridge_operator: {
          oneof: ['ofr_add_bridge_operator']
        },
        _flag_bid_pay_for_inst: {
          oneof: ['flag_bid_pay_for_inst']
        },
        _flag_ofr_pay_for_inst: {
          oneof: ['flag_ofr_pay_for_inst']
        },
        _confirm_time: {
          oneof: ['confirm_time']
        }
      },
      fields: {
        deal_id: {
          type: 'string',
          id: 1
        },
        internal_code: {
          type: 'string',
          id: 2
        },
        create_time: {
          type: 'string',
          id: 3
        },
        update_time: {
          type: 'string',
          id: 4
        },
        deal_type: {
          type: 'DealTypeEnum',
          id: 5
        },
        source: {
          type: 'OperationSourceEnum',
          id: 6
        },
        flag_bridge: {
          type: 'bool',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        send_order_msg: {
          type: 'string',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        bid_send_order_msg: {
          type: 'string',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        ofr_send_order_msg: {
          type: 'string',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        bond_info: {
          type: 'FiccBondBasicStruct',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        confirm_volume: {
          type: 'double',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        price_type: {
          type: 'BondQuoteTypeEnum',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        price: {
          type: 'double',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        yield: {
          type: 'double',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        clean_price: {
          type: 'double',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        full_price: {
          type: 'double',
          id: 17,
          options: {
            proto3_optional: true
          }
        },
        return_point: {
          type: 'double',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        bid_settlement_type: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 19
        },
        bid_traded_date: {
          type: 'string',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        bid_delivery_date: {
          type: 'string',
          id: 21,
          options: {
            proto3_optional: true
          }
        },
        ofr_settlement_type: {
          rule: 'repeated',
          type: 'LiquidationSpeedStruct',
          id: 22
        },
        ofr_traded_date: {
          type: 'string',
          id: 23,
          options: {
            proto3_optional: true
          }
        },
        ofr_delivery_date: {
          type: 'string',
          id: 24,
          options: {
            proto3_optional: true
          }
        },
        bid_bridge_record_id: {
          type: 'string',
          id: 25,
          options: {
            proto3_optional: true
          }
        },
        ofr_bridge_record_id: {
          type: 'string',
          id: 26,
          options: {
            proto3_optional: true
          }
        },
        flag_exchange: {
          type: 'bool',
          id: 27,
          options: {
            proto3_optional: true
          }
        },
        exercise_type: {
          type: 'ExerciseTypeEnum',
          id: 28,
          options: {
            proto3_optional: true
          }
        },
        deal_status: {
          type: 'BondDealStatusEnum',
          id: 29,
          options: {
            proto3_optional: true
          }
        },
        spot_pricinger: {
          type: 'CounterpartyStruct',
          id: 30,
          options: {
            proto3_optional: true
          }
        },
        spot_pricingee: {
          type: 'CounterpartyStruct',
          id: 31,
          options: {
            proto3_optional: true
          }
        },
        spot_pricing_record_id: {
          type: 'string',
          id: 32,
          options: {
            proto3_optional: true
          }
        },
        flag_internal: {
          type: 'bool',
          id: 33,
          options: {
            proto3_optional: true
          }
        },
        operator: {
          type: 'UserStruct',
          id: 34,
          options: {
            proto3_optional: true
          }
        },
        listed_market: {
          type: 'ListedMarketEnum',
          id: 35,
          options: {
            proto3_optional: true
          }
        },
        im_msg_text: {
          type: 'string',
          id: 36,
          options: {
            proto3_optional: true
          }
        },
        im_msg_send_status: {
          type: 'ImMsgSendStatusEnum',
          id: 37,
          options: {
            proto3_optional: true
          }
        },
        im_msg_record_id: {
          type: 'string',
          id: 38,
          options: {
            proto3_optional: true
          }
        },
        quote_id: {
          type: 'string',
          id: 39,
          options: {
            proto3_optional: true
          }
        },
        spot_pricing_volume: {
          type: 'double',
          id: 40,
          options: {
            proto3_optional: true
          }
        },
        remain_volume: {
          type: 'double',
          id: 41,
          options: {
            proto3_optional: true
          }
        },
        bid_old_content: {
          type: 'OldContentStruct',
          id: 42,
          options: {
            proto3_optional: true
          }
        },
        ofr_old_content: {
          type: 'OldContentStruct',
          id: 43,
          options: {
            proto3_optional: true
          }
        },
        bid_deal_read_status: {
          type: 'DealReadStatusEnum',
          id: 44,
          options: {
            proto3_optional: true
          }
        },
        ofr_deal_read_status: {
          type: 'DealReadStatusEnum',
          id: 45,
          options: {
            proto3_optional: true
          }
        },
        exercise_manual: {
          type: 'bool',
          id: 46,
          options: {
            proto3_optional: true
          }
        },
        hand_over_status: {
          type: 'DealHandOverStatusEnum',
          id: 47,
          options: {
            proto3_optional: true
          }
        },
        flag_reverse_sync: {
          type: 'bool',
          id: 48,
          options: {
            proto3_optional: true
          }
        },
        flag_unrefer_quote: {
          type: 'bool',
          id: 49,
          options: {
            proto3_optional: true
          }
        },
        flag_deal_has_changed: {
          type: 'bool',
          id: 50,
          options: {
            proto3_optional: true
          }
        },
        bid_add_bridge_operator: {
          type: 'UserStruct',
          id: 51,
          options: {
            proto3_optional: true
          }
        },
        ofr_add_bridge_operator: {
          type: 'UserStruct',
          id: 52,
          options: {
            proto3_optional: true
          }
        },
        bridge_list: {
          rule: 'repeated',
          type: 'BridgeInfoStruct',
          id: 53
        },
        flag_bid_pay_for_inst: {
          type: 'bool',
          id: 80,
          options: {
            proto3_optional: true
          }
        },
        flag_ofr_pay_for_inst: {
          type: 'bool',
          id: 81,
          options: {
            proto3_optional: true
          }
        },
        confirm_time: {
          type: 'string',
          id: 82,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    BridgeInfoStruct: {
      oneofs: {
        _user: {
          oneof: ['user']
        },
        _trader_tag: {
          oneof: ['trader_tag']
        }
      },
      fields: {
        user: {
          type: 'UserStruct',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        trader: {
          type: 'TraderLiteStruct',
          id: 2
        },
        trader_tag: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        inst: {
          type: 'InstitutionTinyStruct',
          id: 4
        }
      }
    },
    NCDPInfoStruct: {
      oneofs: {
        _price_changed: {
          oneof: ['price_changed']
        },
        _volume: {
          oneof: ['volume']
        },
        _issuer_date: {
          oneof: ['issuer_date']
        },
        _issuer_type: {
          oneof: ['issuer_type']
        },
        _comment: {
          oneof: ['comment']
        },
        _flag_internal: {
          oneof: ['flag_internal']
        },
        _flag_brokerage: {
          oneof: ['flag_brokerage']
        },
        _flag_full: {
          oneof: ['flag_full']
        },
        _operator_name: {
          oneof: ['operator_name']
        },
        _update_time: {
          oneof: ['update_time']
        },
        _issuer_bank_type: {
          oneof: ['issuer_bank_type']
        },
        _inst_code: {
          oneof: ['inst_code']
        },
        _inst_full_name: {
          oneof: ['inst_full_name']
        }
      },
      fields: {
        ncdp_id: {
          type: 'string',
          id: 1
        },
        inst_id: {
          type: 'string',
          id: 2
        },
        inst_name: {
          type: 'string',
          id: 3
        },
        issuer_code: {
          type: 'string',
          id: 4
        },
        issuer_rating_current: {
          type: 'RatingEnum',
          id: 5
        },
        maturity_date: {
          type: 'MaturityDateTypeEnum',
          id: 6
        },
        fr_type: {
          type: 'FRTypeEnum',
          id: 7
        },
        price: {
          type: 'double',
          id: 8
        },
        price_changed: {
          type: 'double',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        volume: {
          type: 'double',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        issuer_date: {
          type: 'string',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        issuer_type: {
          type: 'IssuerDateTypeEnum',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        comment: {
          type: 'string',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        flag_internal: {
          type: 'bool',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        flag_brokerage: {
          type: 'bool',
          id: 15,
          options: {
            proto3_optional: true
          }
        },
        flag_full: {
          type: 'bool',
          id: 16,
          options: {
            proto3_optional: true
          }
        },
        operator: {
          type: 'string',
          id: 17
        },
        operator_name: {
          type: 'string',
          id: 18,
          options: {
            proto3_optional: true
          }
        },
        update_time: {
          type: 'string',
          id: 19,
          options: {
            proto3_optional: true
          }
        },
        issuer_bank_type: {
          type: 'string',
          id: 20,
          options: {
            proto3_optional: true
          }
        },
        inst_code: {
          type: 'string',
          id: 21,
          options: {
            proto3_optional: true
          }
        },
        inst_full_name: {
          type: 'string',
          id: 22,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    NCDPInfoLiteStruct: {
      oneofs: {
        _ncdp_id: {
          oneof: ['ncdp_id']
        },
        _price_changed: {
          oneof: ['price_changed']
        },
        _volume: {
          oneof: ['volume']
        },
        _issuer_date: {
          oneof: ['issuer_date']
        },
        _issuer_type: {
          oneof: ['issuer_type']
        },
        _comment: {
          oneof: ['comment']
        },
        _flag_internal: {
          oneof: ['flag_internal']
        },
        _flag_brokerage: {
          oneof: ['flag_brokerage']
        },
        _flag_full: {
          oneof: ['flag_full']
        }
      },
      fields: {
        ncdp_id: {
          type: 'string',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        inst_id: {
          type: 'string',
          id: 2
        },
        issuer_code: {
          type: 'string',
          id: 3
        },
        issuer_rating_current: {
          type: 'RatingEnum',
          id: 4
        },
        maturity_date: {
          type: 'MaturityDateTypeEnum',
          id: 5
        },
        fr_type: {
          type: 'FRTypeEnum',
          id: 6
        },
        price: {
          type: 'double',
          id: 7
        },
        price_changed: {
          type: 'double',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        volume: {
          type: 'double',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        issuer_date: {
          type: 'string',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        issuer_type: {
          type: 'IssuerDateTypeEnum',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        comment: {
          type: 'string',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        flag_internal: {
          type: 'bool',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        flag_brokerage: {
          type: 'bool',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        flag_full: {
          type: 'bool',
          id: 15,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    NCDPInfoLiteUpdateStruct: {
      oneofs: {
        _inst_id: {
          oneof: ['inst_id']
        },
        _issuer_code: {
          oneof: ['issuer_code']
        },
        _issuer_rating_current: {
          oneof: ['issuer_rating_current']
        },
        _maturity_date: {
          oneof: ['maturity_date']
        },
        _fr_type: {
          oneof: ['fr_type']
        },
        _price: {
          oneof: ['price']
        },
        _price_changed: {
          oneof: ['price_changed']
        },
        _volume: {
          oneof: ['volume']
        },
        _issuer_date: {
          oneof: ['issuer_date']
        },
        _issuer_type: {
          oneof: ['issuer_type']
        },
        _comment: {
          oneof: ['comment']
        },
        _flag_internal: {
          oneof: ['flag_internal']
        },
        _flag_brokerage: {
          oneof: ['flag_brokerage']
        },
        _flag_full: {
          oneof: ['flag_full']
        }
      },
      fields: {
        ncdp_id: {
          type: 'string',
          id: 1
        },
        inst_id: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        issuer_code: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        issuer_rating_current: {
          type: 'RatingEnum',
          id: 4,
          options: {
            proto3_optional: true
          }
        },
        maturity_date: {
          type: 'MaturityDateTypeEnum',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        fr_type: {
          type: 'FRTypeEnum',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        price: {
          type: 'double',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        price_changed: {
          type: 'double',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        volume: {
          type: 'double',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        issuer_date: {
          type: 'string',
          id: 10,
          options: {
            proto3_optional: true
          }
        },
        issuer_type: {
          type: 'IssuerDateTypeEnum',
          id: 11,
          options: {
            proto3_optional: true
          }
        },
        comment: {
          type: 'string',
          id: 12,
          options: {
            proto3_optional: true
          }
        },
        flag_internal: {
          type: 'bool',
          id: 13,
          options: {
            proto3_optional: true
          }
        },
        flag_brokerage: {
          type: 'bool',
          id: 14,
          options: {
            proto3_optional: true
          }
        },
        flag_full: {
          type: 'bool',
          id: 15,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    NCDPOperationInfo: {
      fields: {
        operator: {
          type: 'string',
          id: 1
        },
        operation_type: {
          type: 'NCDPOperationTypeEnum',
          id: 2
        },
        operation_source: {
          type: 'OperationSourceEnum',
          id: 3
        }
      }
    },
    NCDPOperationLogStruct: {
      fields: {
        log_id: {
          type: 'string',
          id: 1
        },
        ncdp_id: {
          type: 'string',
          id: 2
        },
        operator: {
          type: 'string',
          id: 3
        },
        operation_type: {
          type: 'NCDPOperationTypeEnum',
          id: 4
        },
        ncdp_snapshot: {
          type: 'NCDPInfoStruct',
          id: 5
        },
        create_time: {
          type: 'string',
          id: 6
        }
      }
    },
    FilterGroupStruct: {
      oneofs: {
        _group_id: {
          oneof: ['group_id']
        },
        _group_name: {
          oneof: ['group_name']
        },
        _desc: {
          oneof: ['desc']
        }
      },
      fields: {
        group_id: {
          type: 'string',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        group_name: {
          type: 'string',
          id: 3,
          options: {
            proto3_optional: true
          }
        },
        desc: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    CustProdTypeEnum: {
      values: {
        CustProdTypeNone: 0,
        CustProdBCO: 1,
        CustProdBNC: 2,
        CustProdABS: 3,
        CustProdHYB: 4,
        CustProdNCD: 5,
        CustProdNCDP: 6,
        CustProdPC: 7,
        CustProdSLD: 8
      }
    },
    BondCategoryEnum: {
      values: {
        BondCategoryNone: 0,
        SCP: 1,
        CP: 2,
        MTN: 3,
        EB: 4,
        CB: 5,
        SD: 6,
        PPN: 7,
        GB: 8,
        CBB: 9,
        FB: 10,
        LGB: 11,
        OBC: 12
      }
    },
    BondShortNameEnum: {
      values: {
        BondShortNameNone: 0,
        CDB: 1,
        EIB: 2,
        ADB: 3
      }
    },
    ListedMarketEnum: {
      values: {
        ListedMarketNone: 0,
        CIB: 1,
        SSE: 2,
        SZE: 3
      }
    },
    ProductMarketEnum: {
      values: {
        ProductMarketNone: 0,
        ProductMarketBBN: 1,
        ProductMarketBNC: 2,
        ProductMarketBBE: 3,
        ProductMarketBCO: 4,
        ProductMarketNCD: 5
      }
    },
    CollectionMethodEnum: {
      values: {
        CollectionMethodNone: 0,
        SAAA: 1,
        PUB: 2,
        PRI: 3,
        SCV: 4
      }
    },
    BondNatureEnum: {
      values: {
        BondNatureNone: 0,
        GeneralDebt: 1,
        SpecialDebt: 2
      }
    },
    PerpTypeEnum: {
      values: {
        PerpTypeNone: 0,
        PerpSub: 1,
        PerpNotSub: 2,
        NotPerp: 3
      }
    },
    OptionTypeEnum: {
      values: {
        OptionTypeNone: 0,
        CAL: 1,
        CNP: 2,
        ETS: 3,
        NON: 4,
        PUT: 5,
        CNV: 6,
        DCN: 7,
        ASS: 8
      }
    },
    OptionStyleEnum: {
      values: {
        OptionStyleNone: 0,
        EUR: 1,
        AME: 2
      }
    },
    BoolEnum: {
      values: {
        BoolNone: 0,
        Y: 1,
        N: 2
      }
    },
    BankTypeEnum: {
      values: {
        BankTypeNone: 0,
        BankTypeSPD: 1,
        BankTypeMCD: 2,
        BankTypeSHD: 3,
        BankTypeCCD: 4,
        BankTypeFRD: 5,
        BankTypeRRD: 6,
        BankTypeRTD: 7,
        BankTypeOTD: 8
      }
    },
    NcdSubtypeEnum: {
      values: {
        NcdSubtypeNone: 0,
        NcdSubtypeMCB: 1,
        NcdSubtypeSPB: 2,
        NcdSubtypeSHB: 3,
        NcdSubtypeFRB: 4,
        NcdSubtypeRRB: 5,
        NcdSubtypeCCB: 6,
        NcdSubtypeOTB: 7,
        NcdSubtypeRTB: 8
      }
    },
    MktTypeEnum: {
      values: {
        MktTypeNone: 0,
        IntentionalDebt: 1,
        SecondaryDebt: 2
      }
    },
    FormTypeEnum: {
      values: {
        FormTypeNone: 0,
        Basic: 1,
        Optimal: 2,
        MarketDeal: 3,
        DCS: 4,
        Deprecated: 5
      }
    },
    SideEnum: {
      values: {
        SideNone: 0,
        SideBid: 1,
        SideOfr: 2
      }
    },
    DirectionEnum: {
      values: {
        DirectionNone: 0,
        DirectionGvn: 1,
        DirectionTkn: 2,
        DirectionTrd: 3
      }
    },
    MarketDealLastActionTypeEnum: {
      values: {
        MarketDealLastActionTypeNone: 0,
        GvnTkn: 1,
        Join: 2,
        Others: 3
      }
    },
    DealDateTypeEnum: {
      values: {
        DealDateTypeNone: 0,
        Traded: 1,
        Settlement: 2,
        Delivery: 3,
        DealTime: 4
      }
    },
    ReviewStatusEnum: {
      values: {
        ReviewStatusNone: 0,
        Pending: 1,
        Acknowledged: 2,
        Ignored: 3
      }
    },
    RefTypeEnum: {
      values: {
        RefTypeNone: 0,
        Deal: 1,
        Manual: 2,
        Auto: 3
      }
    },
    InstitutionSubtypeEnum: {
      values: {
        InstitutionSubtypeNone: 0,
        CGE: 1,
        LGE: 2,
        PVE: 3,
        OTE: 4
      }
    },
    BondSectorEnum: {
      values: {
        BondSectorNone: 0,
        Bank: 1,
        Brokerages: 2,
        Insurance: 3,
        GN: 4
      }
    },
    BondSubtypeEnum: {
      values: {
        BondSubtypeNone: 0,
        BondSubtypePSB: 1,
        BondSubtypeCBB: 2,
        BondSubtypeCSB: 3,
        BondSubtypeCXB: 4,
        BondSubtypeSEB: 5,
        BondSubtypeSSB: 6,
        BondSubtypeSES: 7
      }
    },
    AssetStatusEnum: {
      values: {
        AssetStatusNone: 0,
        AssetStatusSuperAAA: 1,
        AssetStatusPUB: 2,
        AssetStatusPRI: 3,
        AssetStatusSCV: 4
      }
    },
    RatingEnum: {
      values: {
        RatingNone: 0,
        AAAPlus: 1,
        AAA: 2,
        AAAMinus: 3,
        AAPlus: 4,
        AA: 5,
        AAMinus: 6,
        APlus: 7,
        A: 8,
        AMinus: 9,
        OtherIssuerRating: 10,
        BBBPlus: 11,
        BBB: 12
      }
    },
    OutlookEnum: {
      values: {
        OutlookNone: 0,
        OutlookSTB: 1,
        OutlookRWT: 2,
        OutlookPOS: 3,
        OutlookNON: 4,
        OutlookNEG: 5
      }
    },
    FRTypeEnum: {
      values: {
        FRTypeNone: 0,
        Shibor: 1,
        LPR: 2,
        Depo: 3,
        FRD: 4,
        DR: 5,
        CDC: 6
      }
    },
    MarketOpenStatusEnum: {
      values: {
        MakretUnknown: 0,
        MarketOpen: 1,
        MarketClosed: 2
      }
    },
    OperationTypeEnum: {
      values: {
        OperationUnknown: 0,
        BondDealAddBondDeal: 1,
        BondDealAddBridgeDeal: 2,
        BondDealDeleteBondDeal: 3,
        BondDealUpdate: 4,
        BondDealUpdateDealInfo: 5,
        BondDealUndoUpdateInfo: 6,
        BondQuoteAdd: 7,
        BondQuoteEditReferredQuote: 8,
        BondQuoteGvnTknQuote: 9,
        BondQuoteRefer: 10,
        BondQuoteReferAll: 11,
        BondQuoteUnRefer: 12,
        BondQuoteUpdate: 13,
        BondQuoteUpdateInfo: 14,
        BondQuoteUpdateInternalInfo: 15,
        BondQuoteDeleteQuote: 16,
        BondQuoteUpdateReferredQuote: 17,
        BondQuoteUpdateYiJiBanRate: 18,
        IDCAddQuote: 19,
        IDCUpdateQuote: 20,
        IDCReferQuote: 21,
        IDCGvnTknQuote: 22,
        BondQuoteAddDirection: 23,
        BondQuoteUndoUpdate: 24,
        BondQuoteUndoRefer: 25,
        BondQuoteUndoUnRefer: 26,
        BondQuoteUndoDelete: 27,
        BondQuoteQmRollback: 28,
        BondDealGvnTknDeal: 29,
        BondDealTrdDeal: 30,
        BondDealUndoDelete: 31,
        BondDealUndoUpdate: 32
      }
    },
    OperationSourceEnum: {
      values: {
        OperationSourceNone: 0,
        OperationSourceBdsIdb: 1,
        OperationSourceBdsIdc: 2,
        OperationSourceIdb: 3,
        OperationSourceIdc: 4,
        OperationSourceQm: 5,
        OperationSourceStc: 6,
        OperationSourceOffline: 7,
        OperationSourceQuickChat: 8,
        OperationSourceQuoteDraft: 9,
        OperationSourceReceiptDeal: 10,
        OperationSourceSpotPricing: 11,
        OperationSourceDealRecord: 12,
        OperationSourceApproveReceiptDeal: 13,
        OperationSourceReceiptDealDetail: 14,
        OperationSourceReceiptDealBridge: 15,
        OperationSourceQQGroup: 16,
        OperationSourceDataFeed: 17
      }
    },
    DealDetailUpdateTypeEnum: {
      values: {
        DealDetailUpdateTypeEnumNone: 0,
        DealDetailUpdateCP: 1,
        DealDetailUpdateSendOrderInfo: 2,
        DealDetailUpdateBidSendOrderInfo: 3,
        DealDetailUpdateOfrSendOrderInfo: 4,
        DealDetailUpdateBidBridgeDirection: 5,
        DealDetailUpdateBidSendMsg: 6,
        DealDetailUpdateBidBridgeChannel: 7,
        DealDetailUpdateBidFee: 8,
        DealDetailUpdateBidSendOrderComment: 9,
        DealDetailUpdateBidHideComment: 10,
        DealDetailUpdateBidSendOrderInstList: 11,
        DealDetailUpdateBidBridgeComment: 12,
        DealDetailUpdateOfrBridgeDirection: 13,
        DealDetailUpdateOfrSendMsg: 14,
        DealDetailUpdateOfrBridgeChannel: 15,
        DealDetailUpdateOfrFee: 16,
        DealDetailUpdateOfrSendOrderComment: 17,
        DealDetailUpdateOfrHideComment: 18,
        DealDetailUpdateOfrSendOrderInstList: 19,
        DealDetailUpdateOfrBridgeComment: 20,
        DealDetailUpdateSingleBridgeComment: 21,
        DealDetailUpdateDoubleBridgeSendMsg: 22,
        DealDetailUpdateDoubleBridgeChannel: 23,
        DealDetailUpdateDoubleBridgeFee: 24,
        DealDetailUpdateDoubleBridgeSendOrderComment: 25,
        DealDetailUpdateDoubleBridgeDirection: 26
      }
    },
    DealRecordUpdateTypeEnum: {
      values: {
        DealRecordUpdateTypeEnumNone: 0,
        DealRecordUpdateBond: 1,
        DealRecordUpdatePrice: 2,
        DealRecordUpdateReturnPoint: 3,
        DealRecordUpdatePriceType: 4,
        DealRecordUpdateConfirmVolume: 5,
        DealRecordUpdateBidSettlementType: 6,
        DealRecordUpdateOfrSettlementType: 7,
        DealRecordUpdateBidTradedDate: 8,
        DealRecordUpdateBidDeliveryDate: 9,
        DealRecordUpdateOfrTradedDate: 10,
        DealRecordUpdateOfrDeliveryDate: 11,
        DealRecordUpdateFlagStockExchange: 12,
        DealRecordUpdateExerciseType: 13,
        DealRecordUpdateSpotPricingee: 14,
        DealRecordUpdateSpotPricinger: 15,
        DealRecordUpdateFlagBridge: 16,
        DealRecordUpdateSendOrderMsg: 17,
        DealRecordUpdateBidSendOrderMsg: 18,
        DealRecordUpdateOfrSendOrderMsg: 19,
        DealRecordUpdateStaggerDate: 20,
        DealRecordUpdateCP: 21
      }
    },
    SceniorityEnum: {
      values: {
        SceniorityEnumNone: 0,
        SceniorityFIN: 1,
        SceniorityGEN: 2,
        ScenioritySUB: 3,
        SceniorityMIX: 4
      }
    },
    ProductClassEnum: {
      values: {
        ProductClassEnumNone: 0,
        FixedIncome: 1,
        Derivatives: 2,
        Funds: 3,
        Currencies: 4
      }
    },
    IsCrossMktEnum: {
      values: {
        CrossMktEnumNone: 0,
        CrossMktY: 1,
        CrossMktN: 2
      }
    },
    IsMortgageEnum: {
      values: {
        MortgageEnumNone: 0,
        MortgageY: 1,
        MortgageN: 2
      }
    },
    IsMunicipalEnum: {
      values: {
        MunicipalEnumNone: 0,
        MunicipalY: 1,
        MunicipalN: 2
      }
    },
    DateIsHolidayEnum: {
      values: {
        DateIsHolidayEnumNone: 0,
        Holiday: 1,
        Workday: 2
      }
    },
    FiccBondInfoLevelEnum: {
      values: {
        FiccBondInfoLevelNone: 0,
        BasicInfo: 1,
        AppendixInfo: 2
      }
    },
    FiccBondInfoLevelV2Enum: {
      values: {
        FiccBondInfoLevelV2None: 0,
        InfoLevelBasic: 1,
        InfoLevelDetail: 2
      }
    },
    BondSearchTypeEnum: {
      values: {
        BondSearchTypeNone: 0,
        SearchAllField: 1,
        SearchCode: 2,
        SearchShortName: 3,
        SearchFullName: 4,
        SearchPinyin: 5,
        SearchDealProcess: 6,
        SearchParsing: 7
      }
    },
    SpotPricingConfirmStatusEnum: {
      values: {
        ConfirmStatusNone: 0,
        ConfirmToBe: 1,
        Confirmed: 2,
        Refuse: 3,
        PartConfirmed: 4,
        Delete: 5
      }
    },
    DealOrderTypeEnum: {
      values: {
        DealOrderTypeNone: 0,
        MarketOrderDeal: 1,
        DCSOrderDeal: 2,
        AllDeal: 3
      }
    },
    DealTypeEnum: {
      values: {
        DealTypeNone: 0,
        GVN: 1,
        TKN: 2,
        TRD: 3
      }
    },
    SendDealMegEnum: {
      values: {
        SendDealMeg: 0,
        NotSendDeal: 1,
        SendedDeal: 2
      }
    },
    TradeModeEnum: {
      values: {
        TradeModeNone: 0,
        QQ: 1,
        QM: 2,
        Line: 3,
        Phone: 4,
        RM: 5
      }
    },
    SourceEnum: {
      values: {
        SourceNone: 0,
        IDB: 1,
        IDC: 2,
        BDS: 3,
        STC: 4,
        OFFLine: 5,
        SourceQM: 6
      }
    },
    BondQuoteTypeEnum: {
      values: {
        TypeNone: 0,
        CleanPrice: 1,
        FullPrice: 2,
        Yield: 3,
        Spread: 4
      }
    },
    FuzzySearchTypeEnum: {
      values: {
        FuzzySearchTypeNone: 0,
        GroupingManagement: 1,
        MainPage: 2
      }
    },
    UserHotkeyFunctionEnum: {
      values: {
        UserHotkeyFunctionNone: 0,
        UserHotkeyHotkeyWindow: 1,
        UserHotkeyOpenQuoteWindow: 2,
        UserHotkeyQuoteJoin: 3,
        UserHotkeyQuoteRefer: 4,
        UserHotkeyQuoteAddStar: 5,
        UserHotkeyQuoteAddDoubleStar: 6,
        UserHotkeyQuoteBatch: 7,
        UserHotkeyTrade: 8,
        UserHotkeyGVNTKNDeal: 9,
        UserHotkeyTRDDeal: 10,
        UserHotkeyOCO: 11,
        UserHotkeyPackageKey: 12,
        UserHotkeyShowAll: 13,
        UserHotkeyRefresh: 14,
        UserHotkeyRemarkOne: 15,
        UserHotkeyRemarkTwo: 16,
        UserHotkeyValuationQuote: 17,
        UserHotkeyInternalConversion: 18,
        UserHotkeySearchCompleteQuote: 19,
        UserHotkeyQuoteAddZero: 20,
        UserHotkeyQuoteAddOne: 21,
        UserHotkeyQuoteTomorrowAddZero: 22,
        UserHotkeyQuoteTomorrowAddOne: 23,
        UserHotkeyQuoteMonday: 24,
        UserHotkeyQuoteTuesday: 25,
        UserHotkeyQuoteWednesday: 26,
        UserHotkeyQuoteThursday: 27,
        UserHotkeyQuoteFriday: 28,
        UserHotkeyAlmostDone: 29,
        UserHotkeyRecommend: 30,
        UserHotkeyBondCalculator: 31,
        UserHotkeyRemarkThree: 32,
        UserHotkeyRemarkFour: 33,
        UserHotkeyRemarkFive: 34,
        UserHotkeyRemarkSix: 35,
        UserHotkeyRemarkSeven: 36,
        UserHotkeyRemarkEight: 37,
        UserHotkeyQuoteUnRefer: 38,
        UserHotkeyOpenBatchQuoteWindow: 39,
        UserHotkeyMarketRotation: 40
      }
    },
    UserSettingFunctionEnum: {
      values: {
        UserSettingFunctionNone: 0,
        UserSettingQuoteShortcutWaitTime: 1,
        UserSettingAmountShortcutWaitTime: 2,
        UserSettingQuoteAutoAddStar: 3,
        UserSettingQuoteAmount: 5,
        UserSettingValuationDecimalDigit: 6,
        UserSettingQuoteImportQMGroup: 7,
        UserSettingCreditGroup: 8,
        UserSettingRateGroup: 9,
        UserSettingOptimalQuoteCopyMethod: 10,
        UserSettingIncludeValuation: 11,
        UserSettingIncludeDuration: 12,
        UserSettingIncludeIssueAmount: 13,
        UserSettingIncludeMaturityDate: 14,
        UserSettingSortByTerm: 15,
        UserSettingDisplaySetting: 16,
        UserSettingLocationDisplay: 17,
        UserSettingInitSearchBond: 18,
        UserSettingTeamCollaboration: 19,
        UserSettingDCSAutoFillBroker: 20,
        UserSettingDCSDefaultCommissionN: 21,
        UserSettingDCSDefaultTPlusZero: 22,
        UserSettingSettlementBCO: 23,
        UserSettingTabs: 24,
        UserSettingBCOTableColumn: 25,
        UserSettingBNCTableColumn: 26,
        UserSettingABSTableColumn: 27,
        UserSettingBCOBondDetailColumn: 28,
        UserSettingBNCBondDetailColumn: 29,
        UserSettingABSBondDetailColumn: 30,
        UserSettingSettlementGroupBCO: 31,
        UserSettingSettlementBNC: 32,
        UserSettingSettlementABS: 33,
        UserSettingCompleteQuoteMainColumn: 34,
        UserSettingCompleteQuoteExpandColumn: 35,
        UserSettingSettlementGroupBNC: 36,
        UserSettingSettlementGroupABS: 37,
        UserSettingQuoteOperationLogColumn: 38,
        UserSettingQuoteParsingDefaultFlagStar: 39,
        UserSettingBatchParsingDefaultFlagStar: 40,
        UserSettingMarketDealLogColumn: 41,
        UserSettingBridgeTop: 42,
        UserSettingOfflineDeal: 43,
        UserSettingMarketRotation: 44,
        UserSettingQuoteWindowColumn: 45,
        UserSettingOptimalQuoteDisplayAmount: 46,
        UserSettingQuoteDraftBrokerGroups: 47,
        UserSettingQuoteDraftCurrentBrokerGroup: 48,
        UserSettingOppositePriceNotificationWindow: 49,
        UserSettingGroupManagementOrder: 50,
        UserSettingOppositePriceNotificationTraderMap: 51,
        UserSettingNavigationMenu: 52,
        UserSettingCoQuoteVolume: 53,
        UserSettingFilterGroup: 54
      }
    },
    UserPreferenceTypeEnum: {
      values: {
        UserPreferenceTypeNone: 0,
        UserPreferenceSearchTrader: 1,
        UserPreferenceDealDetailButton: 2
      }
    },
    UserAccessGrantTypeEnum: {
      values: {
        UserAccessGrantTypeNone: 0,
        UserAccessGrantTypeIdcDeal: 1,
        UserAccessGrantTypeReceiptDeal: 2,
        UserAccessGrantTypeDealInfo: 3,
        UserAccessGrantTypeDealDetailBridge: 4
      }
    },
    QuoteSortedFieldEnum: {
      values: {
        FieldNone: 0,
        FieldFirstMaturityDate: 1,
        FieldBondCode: 2,
        FieldBondShortName: 3,
        FieldBid: 4,
        FieldOfr: 5,
        FieldVolume: 6,
        FieldBroker: 7,
        FieldIssuerRatingVal: 8,
        FieldUpdateTime: 9,
        FieldBondRatingVal: 10,
        FieldValCleanPrice: 11,
        FieldValYield: 12,
        FieldCsiCleanPrice: 13,
        FieldCsiFullPrice: 14,
        FieldCsiYield: 15,
        FieldTrader: 16,
        FieldFullPrice: 17,
        FieldCleanPrice: 18,
        FieldSpread: 19,
        FieldListedDate: 20,
        FieldValModifiedDuration: 21,
        FieldValConvexity: 22,
        FieldValBasisPointValue: 23,
        FieldIssuerOutlookCurrent: 24,
        FieldOperator: 25,
        FieldCreateTime: 26,
        FieldComment: 27,
        FieldRefType: 28,
        FieldConversionRate: 29,
        FieldCbcRatingVal: 30,
        FieldMaturityDate: 31,
        FieldCouponRateCurrent: 32,
        FieldCPBid: 33,
        FieldVolBid: 34,
        FieldCPOfr: 35,
        FieldVolOfr: 36,
        FieldNBid: 37,
        FieldNOfr: 38,
        FieldBrokerBid: 39,
        FieldBrokerOfr: 40,
        FiledOffsetBid: 41,
        FiledOffsetOfr: 42,
        FieldFullPriceBid: 43,
        FieldCleanPriceBid: 44,
        FieldSpreadBid: 45,
        FieldFullPriceOfr: 46,
        FieldCleanPriceOfr: 47,
        FieldSpreadOfr: 48,
        FieldImpliedRating: 49,
        ReferTime: 50,
        FieldDealPrice: 51,
        FieldTradedDate: 52,
        FieldDeliveryDate: 53,
        FieldDealTime: 54,
        FieldIssuerInst: 55,
        FieldIssuerDate: 56,
        FieldPrice: 57,
        FieldPriceChange: 58,
        FieldSide: 59
      }
    },
    UserOSTypeEnum: {
      values: {
        UserOSTypeNone: 0,
        Mac: 1,
        Windows: 2
      }
    },
    RepaymentMethodEnum: {
      values: {
        RepayNone: 0,
        RepayInAdvance: 1,
        RepayAtOnce: 2
      }
    },
    CompleteQuoteGroupEnum: {
      values: {
        GroupNone: 0,
        GroupGB: 1,
        GroupLGB: 2,
        GroupCBB: 3,
        GroupFBFRD: 4,
        GroupFBFRDOption: 5,
        GroupFBShibor: 6,
        GroupFBShiborOption: 7,
        GroupFBLPR: 8,
        GroupFBLPROption: 9,
        GroupDepo: 10,
        GroupDepoOption: 11,
        GroupDR: 12
      }
    },
    LiquidationSpeedTagEnum: {
      values: {
        LiquidationSpeedTagNone: 0,
        Today: 1,
        Tomorrow: 2,
        Monday: 3,
        Tuesday: 4,
        Wednesday: 5,
        Thursday: 6,
        Friday: 7,
        Saturday: 8,
        Sunday: 9,
        Default: 10
      }
    },
    DataSyncMessageTypeEnum: {
      values: {
        DataSyncMessageTypeNone: 0,
        SyncData: 1,
        SyncPing: 2,
        SyncPong: 3,
        SyncAck: 4,
        SyncClose: 5,
        SyncDone: 6
      }
    },
    BridgeChannelEnum: {
      values: {
        ChannelEnumNone: 0,
        Talk: 1,
        Request: 2,
        BothSides: 3,
        Xbond: 4,
        Ideal: 5,
        ChannelFixedIncome: 6,
        Bidding: 7,
        Bulk: 8
      }
    },
    SettlementLabelEnum: {
      values: {
        SettlementLabelNone: 0,
        SettlementLabelToday: 1,
        SettlementLabelTomorrow: 2,
        SettlementLabelOther: 3
      }
    },
    ExerciseTypeEnum: {
      values: {
        ExerciseTypeNone: 0,
        Exercise: 1,
        Expiration: 2
      }
    },
    SpotPricingFailedReasonEnum: {
      values: {
        SpotPricingFailedReasonNone: 0,
        QuoteInvalid: 1,
        MarketChanged: 2
      }
    },
    SpotPricingImMsgSendStatusEnum: {
      values: {
        SpotPricingImMsgSendStatusNone: 0,
        SpotPricingSending: 1,
        SpotPricingSendSuccess: 2,
        SpotPricingBrokerNoImId: 3,
        SpotPricingTraderNoImId: 4,
        SpotPricingIMHelperOffline: 5,
        SpotPricingNotFriends: 6,
        SpotPricingOtherSendErr: 7
      }
    },
    QuoteRelatedInfoFailedTypeEnum: {
      values: {
        FailedTypeNone: 0,
        FailedTypeTraderOrInst: 1,
        FailedTypeBroker: 2,
        FailedTypeDelistedDate: 3,
        FailedTypeOtherProcessed: 4
      }
    },
    ReceiverSideEnum: {
      values: {
        ReceiverSideNone: 0,
        SpotPricinger: 1,
        BeSpotPricinger: 2
      }
    },
    NotifyTypeEnum: {
      values: {
        NotifyTypeNone: 0,
        NotifyTypeSpotPricing: 1,
        NotifyTypeOffline: 2
      }
    },
    DealOperationTypeEnum: {
      values: {
        DealOperationTypeNone: 0,
        DOTSpotPricing: 1,
        DOTBrokerAConfirm: 2,
        DOTBrokerAReject: 3,
        DOTBrokerBConfirm: 4,
        DOTBrokerBPartiallyFilled: 5,
        DOTBrokerBReject: 6,
        DOTOfflineConfirm: 7,
        DOTCreateByClone: 8,
        DOTCloned: 9,
        DOTReceiptDealInput: 10,
        DOTReceiptDealJoin: 11,
        DOTAssociateBridge: 12,
        DOTModifyDeal: 13,
        DOTModifySendOrderInfo: 14,
        DOTPrint: 15,
        DOTApprovalRuleReset: 16,
        DOTReceiptDealSubmit: 17,
        DOTReceiptDealDestroy: 18,
        DOTReceiptDealApprove: 19,
        DOTReceiptDealReturn: 20,
        DOTAddBridge: 21,
        DOTDeleteBridge: 22,
        DOTResetBridge: 23,
        DOTChangeBridge: 24,
        DOTModifyBridgeInfo: 25,
        DOTSend: 26,
        DOTRemindOrder: 27,
        DOTHandOver: 28,
        DOTReceiptDealDelete: 29,
        DOTReceiptDealBidConfirm: 30,
        DOTReceiptDealOfrConfirm: 31,
        DOTNewDeal: 32,
        DOTBrokerAAsking: 33,
        DOTBrokerBAsking: 34,
        DOTDeleteDealRecord: 35,
        DOTAddDoubleBridge: 36,
        DOTReceiptDealMulConfirm: 37
      }
    },
    AudioTypeEnum: {
      values: {
        AudioNone: 0,
        AudioDeal: 1,
        AudioChoice: 2,
        AudioInvented: 3
      }
    },
    DealReadStatusEnum: {
      values: {
        DealReadStatusNone: 0,
        Read: 1,
        CurUnread: 2,
        OppUnread: 3
      }
    },
    QuoteDraftDetailStatusEnum: {
      values: {
        QuoteDraftDetailStatusNone: 0,
        QuoteDraftDetailStatusPending: 1,
        QuoteDraftDetailStatusConfirmed: 2,
        QuoteDraftDetailStatusIgnored: 5
      }
    },
    QuoteDraftMessageStatusEnum: {
      values: {
        QuoteDraftMessageStatusNone: 0,
        QuoteDraftMessageStatusPending: 1,
        QuoteDraftMessageStatusProcessed: 2
      }
    },
    BondDealStatusEnum: {
      values: {
        BondDealStatusNone: 0,
        DealConfirming: 1,
        DealConfirmed: 2,
        DealRefuse: 3,
        DealPartConfirmed: 4,
        DealDelete: 5,
        DealAsking: 6
      }
    },
    BridgeSideEnum: {
      values: {
        BridgeSideNone: 0,
        BridgeSideOfr: 1,
        BridgeSideBid: 2,
        BridgeSideOfrEditing: 3,
        BridgeSideBidEditing: 4
      }
    },
    BridgeDirectionEnum: {
      values: {
        BridgeDirectionNone: 0,
        TradeInst2Bridge: 1,
        Bridge2TradeInst: 2
      }
    },
    DoubleBridgeDirectionEnum: {
      values: {
        DoubleBridgeDirectionNone: 0,
        DoubleBridgeOfr2Bid: 1,
        DoubleBridgeBid2Ofr: 2
      }
    },
    NonBridgeDirectionEnum: {
      values: {
        NonBridgeDirectionNone: 0,
        NonBridgeOfr2Bid: 1,
        NonBridgeBid2Ofr: 2
      }
    },
    OppositePriceNotifyMsgFillTypeEnum: {
      values: {
        OppositePriceNotifyMsgFillTypeNone: 0,
        OppositePriceNotifyMsgFillTypeAllMsg: 1,
        OppositePriceNotifyMsgFillTypeNoMsg: 2,
        OppositePriceNotifyMsgFillTypeExcludeHist: 3,
        OppositePriceNotifyMsgFillTypeOnlyCurrent: 4,
        OppositePriceNotifyMsgFillTypeExcludeDeal: 5
      }
    },
    OppositePriceNotifyLogicTypeEnum: {
      values: {
        OppositePriceNotifyLogicTypeNone: 0,
        NotifyLogicTypeFirstOppositePrice: 1,
        NotifyLogicTypeBetterPriceOnSameSide: 2,
        NotifyLogicTypeBetterPriceOnOppositeSide: 3,
        NotifyLogicTypeWorsePriceOnSameSide: 4,
        NotifyLogicTypeWorsePriceOnOppositeSide: 5,
        NotifyLogicTypeNoQuoteOnOppositeSide: 6,
        NotifyLogicTypeNewQuoteWithOppositePrice: 7,
        NotifyLogicTypeBidPriceOnOppositeSide: 8,
        NotifyLogicTypeOfrPriceOnOppositeSide: 9,
        NotifyLogicTypeHasCurrentDeal: 10,
        NotifyLogicTypeHasHistDeal: 11,
        NotifyLogicTypeLessPriceDifference: 12,
        NotifyLogicTypeOfrPriceOffset: 13,
        NotifyLogicTypeBidPriceOffset: 14
      }
    },
    OppositePriceNotifyColorEnum: {
      values: {
        OppositePriceNotifyColorNone: 0,
        OppositePriceNotifyColorPrimary: 1,
        OppositePriceNotifyColorAuxiliary: 2,
        OppositePriceNotifyColorOfr: 3,
        OppositePriceNotifyColorRed: 4,
        OppositePriceNotifyColorGolden: 5,
        OppositePriceNotifyColorTrd: 6
      }
    },
    QuoteDraftIgnoreTypeEnum: {
      values: {
        QuoteDraftIgnoreTypeNone: 0,
        QuoteDraftIgnoreTypeIDList: 1,
        QuoteDraftIgnoreTypeAll: 2,
        QuoteDraftIgnoreTypeMessage: 4
      }
    },
    QuoteDraftModifiedStatusEnum: {
      values: {
        QuoteDraftMulModifiedStatusClear: 0,
        QuoteDraftMulModifiedStatusOnce: 1,
        QuoteDraftMulModifiedStatusMul: 2
      }
    },
    DealHandOverStatusEnum: {
      values: {
        DealHandOverStatusNone: 0,
        CanHandOver: 1,
        CanNotHandOver: 2,
        HandOver: 3
      }
    },
    SettlementModeEnum: {
      values: {
        SettlementModeNone: 0,
        DVP: 1
      }
    },
    BrokerageTypeEnum: {
      values: {
        BrokerageTypeNone: 0,
        BrokerageTypeC: 1,
        BrokerageTypeN: 2,
        BrokerageTypeB: 3,
        BrokerageTypeR: 4
      }
    },
    ReceiptDealOperationTypeEnum: {
      values: {
        ReceiptDealOperationTypeNone: 0,
        ReceiptDealAdd: 1,
        ReceiptDealBidConfirm: 2,
        ReceiptDealOfrConfirm: 3,
        ReceiptDealModify: 4,
        ReceiptDealDelete: 5,
        ReceiptDealSubmit: 6,
        ReceiptDealDestroy: 7,
        ReceiptDealApprove: 8,
        ReceiptDealReturn: 9,
        ReceiptDealPrint: 10,
        ReceiptDealRuleReset: 11,
        ReceiptDealAssociateBridge: 12,
        ReceiptDealHandOver: 13,
        ReceiptDealBrokerAAsking: 14,
        ReceiptDealBrokerBAsking: 15,
        ReceiptDealMulConfirm: 16
      }
    },
    ReceiptDealStatusEnum: {
      values: {
        ReceiptDealStatusNone: 0,
        ReceiptDealToBeHandOver: 1,
        ReceiptDealToBeConfirmed: 2,
        ReceiptDealToBeSubmitted: 3,
        ReceiptDealSubmitApproval: 4,
        ReceiptDealToBeExamined: 5,
        ReceiptDealNoPass: 6,
        ReceiptDealPass: 7,
        ReceiptDealDestroyed: 8,
        ReceiptDealDeleted: 9
      }
    },
    ReceiptDealSortedFieldEnum: {
      values: {
        ReceiptDealSortedFieldNone: 0,
        RDSortInternalCode: 1,
        RDSortSeqNumber: 2,
        RDSortOrderNo: 3,
        RDSortFirstMaturityDate: 4,
        RDSortBondCode: 5,
        RDSortPrice: 6,
        RDSortVolume: 7,
        RDSortTradedDate: 8,
        RDSortDeliveryDate: 9,
        RDSortDealDate: 10,
        RDSortValCleanPrice: 11,
        RDSortValYield: 12,
        RDSortCsiCleanPrice: 13,
        RDSortCsiFullPrice: 14,
        RDSortCsiYield: 15,
        RDSortUpdateTime: 16,
        RDSortListedDate: 17,
        RDSortMaturityDate: 18,
        RDSortSendStatus: 19
      }
    },
    ReceiptDealUpdateTypeEnum: {
      values: {
        ReceiptDealDelUpdateTypeEnumNone: 0,
        RDUpdateDelBridge: 1,
        RDUpdateAddBridge: 2,
        RDUpdateBridgeFlag: 3,
        RDUpdateUrgentFlag: 4,
        RDUpdateStatus: 5,
        RDUpdatePrice: 6,
        RDUpdateInternalFlag: 7,
        RDUpdateVol: 8,
        RDUpdateBidBroker: 9,
        RDUpdateOfrBroker: 10,
        RDUpdateCPBid: 11,
        RDUpdateCPOfr: 12,
        RDUpdateTradedDate: 13,
        RDUpdateDeliveryDate: 14,
        RDUpdateDealDate: 15,
        RDUpdateLiquidationSpeed: 16,
        RDUpdateBidPayFor: 17,
        RDUpdateOfrPayFor: 18,
        RDUpdateBidPayForNC: 19,
        RDUpdateOfrPayForNC: 20,
        RDUpdateSettlementMode: 21,
        RDUpdateExercise: 22,
        RDUpdateDealDirection: 23,
        RDUpdateOrderNo: 24,
        RDUpdateYield: 25,
        RDUpdateSpread: 26,
        RDUpdateCleanPrice: 27,
        RDUpdateFullPrice: 28,
        RDUpdateMktType: 29,
        RDUpdateBidBrokerageType: 30,
        RDUpdateOfrBrokerageType: 31,
        RDUpdateBidTradeMode: 32,
        RDUpdateOfrTradeMode: 33,
        RDUpdateBidNC: 34,
        RDUpdateOfrNC: 35,
        RDUpdateBackendMsg: 36,
        RDUpdateBidInstSpecial: 37,
        RDUpdateOfrInstSpecial: 38,
        RDUpdateBridgeCode: 39,
        RDUpdateBondCode: 40,
        RDUpdateOtherDetail: 41,
        RDUpdateUpdateTime: 42,
        RDUpdateSettlementAmount: 43,
        RDInternalCode: 44,
        RDSeqNumber: 45,
        RDUpdateSorSendStatus: 46
      }
    },
    ReceiptDealTradeInstBrokerageCommentEnum: {
      values: {
        RDTradeInstBrokerageCommentEnumNone: 0,
        RDTradeInstBrokerageCommentNormalBrokerage: 1,
        RDTradeInstBrokerageCommentNoSignOrObjection: 2,
        RDTradeInstBrokerageCommentStopLoss: 3,
        RDTradeInstBrokerageCommentEmergency: 4,
        RDTradeInstBrokerageCommentChannel: 5,
        RDTradeInstBrokerageCommentNotFoundOrUnArrangePayFor: 6,
        RDTradeInstBrokerageCommentOneTimeSettlement: 7,
        RDTradeInstBrokerageCommentOthers: 8,
        RDTradeInstBrokerageCommentSpecial: 9
      }
    },
    ReceiptDealRuleTypeEnum: {
      values: {
        ReceiptDealRuleTypeNone: 0,
        ReceiptDealRuleTypeDefault: 1,
        ReceiptDealRuleTypeSpecialBrokerage: 2,
        ReceiptDealRuleTypeMD: 3,
        ReceiptDealRuleTypeDestroyDeal: 4,
        ReceiptDealRuleTypeNC: 5,
        ReceiptDealRuleTypeSD: 6
      }
    },
    ReceiptDealRuleSubtypeEnum: {
      values: {
        ReceiptDealRuleSubtypeNone: 0,
        ReceiptDealRuleSubtypeSameYear: 1,
        ReceiptDealRuleSubtypeDifferentYear: 2,
        ReceiptDealRuleSubtypeSameMonth: 3,
        ReceiptDealRuleSubtypeDifferentMonth: 4,
        ReceiptDealRuleSubtypeSameDay: 5,
        ReceiptDealRuleSubtypeDifferentDay: 6
      }
    },
    AdvancedApprovalTypeEnum: {
      values: {
        AdvancedApprovalTypeNone: 0,
        AdvancedApprovalTypeAny: 1,
        AdvancedApprovalTypeSpecialBrokerage: 2,
        AdvancedApprovalTypeMD: 3,
        AdvancedApprovalTypeDestroy: 4,
        AdvancedApprovalTypeNC: 5,
        AdvancedApprovalTypeSD: 6
      }
    },
    ReceiptDealConflictTypeEnum: {
      values: {
        ReceiptDealConflictTypeNone: 0,
        UnSubmit: 1,
        AuthorityChange: 2,
        Handled: 3
      }
    },
    CheckBridgeEnum: {
      values: {
        CheckBridgeEnumNone: 0,
        HasBridge: 1,
        Inverse: 2,
        Submitted: 3,
        Paid: 4,
        SorSentModified: 5
      }
    },
    DealMarketTypeEnum: {
      values: {
        DealMarketNone: 0,
        PrimaryMarket: 1,
        SecondaryMarket: 2
      }
    },
    HistDealStatusEnum: {
      values: {
        HistDealStatusNone: 0,
        HistDealToBeHandOver: 1,
        HistDealHasHandOver: 2,
        HistDealDeleted: 3,
        HistDealToBeConfirm: 4,
        HistDealRefused: 5
      }
    },
    UploadFileScene: {
      values: {
        UploadFileSceneNone: 0,
        UploadFileSceneImage: 1
      }
    },
    AcceptorEnum: {
      values: {
        AcceptorNone: 0,
        AcceptorWind: 1,
        AcceptorSor: 2
      }
    },
    MarketNotifyMsgTypeEnum: {
      values: {
        MarketNotifyMsgTypeNone: 0,
        MarketNotifyMsgBondHandicap: 1,
        MarketNotifyMsgDeal: 2,
        MarketNotifySorAD: 3,
        MarketNotifySorCT: 4,
        MarketNotifySorRST: 5,
        MarketNotifySorAE: 6,
        MarketNotifySorRTS: 7
      }
    },
    LocalServerRealtimeSceneEnum: {
      values: {
        LocalServerRealtimeSceneNone: 0,
        LocalServerRealtimeSceneOptimalQuote: 1,
        LocalServerRealtimeSceneGetQuoteByKeyMarket: 2,
        LocalServerRealtimeSceneGetQuoteById: 3,
        LocalServerRealtimeSceneDealInfo: 4
      }
    },
    OptimalQuoteSettlementTypeEnum: {
      values: {
        OptimalQuoteSettlementTypeNone: 0,
        OptimalQuoteSettlementTypeTodayPlus0: 1,
        OptimalQuoteSettlementTypeTodayPlus1: 2,
        OptimalQuoteSettlementTypeTomorrowPlus0: 3,
        OptimalQuoteSettlementTypeForward: 4
      }
    },
    LocalServerWsMsgTypeEnum: {
      values: {
        LocalServerWsMsgNone: 0,
        LocalServerWsMsgPing: 1,
        LocalServerWsMsgPong: 2,
        LocalServerWsMsgRequest: 3,
        LocalServerWsMsgResponse: 4
      }
    },
    LocalServerRequestTypeEnum: {
      values: {
        LocalServerRequestNone: 0,
        Register: 1,
        Update: 2,
        DeRegister: 3
      }
    },
    ApprovalSortedFieldEnum: {
      values: {
        ReceiptChildDealSortedFieldNone: 0,
        SortOrderNo: 1,
        SortPrice: 2,
        SortVolume: 3,
        SortTradedDate: 4
      }
    },
    DealSorSendStatusEnum: {
      values: {
        DealSorSendStatusNone: 0,
        DSSendStatusToBeSent: 1,
        DSSendStatusSent: 2,
        DSSendStatusApplying: 3,
        DSSendStatusRefused: 4,
        DSSendStatusInstruction: 5,
        DSSendStatusToBeExecuted: 6,
        DSSendStatusWithdrew: 7,
        DSSendStatusDeleted: 8,
        DSSendStatusExecuting: 9,
        DSSendStatusConfirmed: 10
      }
    },
    IssuerDateTypeEnum: {
      values: {
        IssuerDateTypeNone: 0,
        IssuerDateTypeMonday: 1,
        IssuerDateTypeTuesday: 2,
        IssuerDateTypeWednesday: 3,
        IssuerDateTypeThursday: 4,
        IssuerDateTypeFriday: 5,
        IssuerDateTypeSaturday: 6,
        IssuerDateTypeSunday: 7,
        IssuerDateTypeToday: 8,
        IssuerDateTypeRecent: 9
      }
    },
    MaturityDateTypeEnum: {
      values: {
        MaturityDateTypeNone: 0,
        OneMonth: 1,
        ThreeMonth: 2,
        SixMonth: 3,
        NineMonth: 4,
        OneYear: 5
      }
    },
    NCDPOperationTypeEnum: {
      values: {
        NcdPOperationTypeNone: 0,
        NcdPAdd: 1,
        NcdPModify: 2,
        NcdPQuickModify: 3,
        NcdPDelete: 4,
        NcdPSystemDelete: 5
      }
    },
    DateTypeEnum: {
      values: {
        DateTypeNone: 0,
        Year: 1,
        Month: 2,
        Day: 3
      }
    },
    bdm_bds_bds_api_base_data_base_sync_data_scan_request: {
      oneofs: {
        _search_after: {
          oneof: ['search_after']
        },
        _local_version: {
          oneof: ['local_version']
        },
        _holiday_start_time: {
          oneof: ['holiday_start_time']
        },
        _unlimited: {
          oneof: ['unlimited']
        },
        _compressed: {
          oneof: ['compressed']
        },
        _start_time: {
          oneof: ['start_time']
        },
        _end_time: {
          oneof: ['end_time']
        }
      },
      fields: {
        sync_data_type: {
          type: 'SyncDataTypeEnum',
          id: 1
        },
        search_after: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        count: {
          type: 'int32',
          id: 3
        },
        product_type_list: {
          rule: 'repeated',
          type: 'ProductTypeEnum',
          id: 4
        },
        local_version: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        holiday_start_time: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        unlimited: {
          type: 'bool',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        compressed: {
          type: 'bool',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        start_time: {
          type: 'string',
          id: 9,
          options: {
            proto3_optional: true
          }
        },
        end_time: {
          type: 'string',
          id: 10,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    bdm_bds_bds_api_base_data_base_sync_data_scan_response: {
      oneofs: {
        _base_response: {
          oneof: ['base_response']
        },
        _search_after: {
          oneof: ['search_after']
        },
        _data: {
          oneof: ['data']
        }
      },
      fields: {
        base_response: {
          type: 'BaseResponseStruct',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        search_after: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        trader_list: {
          rule: 'repeated',
          type: 'TraderSyncStruct',
          id: 3
        },
        inst_list: {
          rule: 'repeated',
          type: 'InstSyncStruct',
          id: 4
        },
        user_list: {
          rule: 'repeated',
          type: 'UserSyncStruct',
          id: 5
        },
        bond_basic_list: {
          rule: 'repeated',
          type: 'BondBasicSyncStruct',
          id: 6
        },
        bond_appendix_list: {
          rule: 'repeated',
          type: 'BondAppendixSyncStruct',
          id: 7
        },
        holiday_list: {
          rule: 'repeated',
          type: 'HolidaySyncStruct',
          id: 8
        },
        bond_detail_list: {
          rule: 'repeated',
          type: 'BondDetailSyncStruct',
          id: 9
        },
        issuer_lite_list: {
          rule: 'repeated',
          type: 'IssuerLiteStruct',
          id: 10
        },
        data: {
          type: 'bytes',
          id: 11,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    bdm_bds_bds_api_base_data_sync_data_scan_request: {
      oneofs: {
        _search_after: {
          oneof: ['search_after']
        },
        _local_version: {
          oneof: ['local_version']
        },
        _start_time: {
          oneof: ['start_time']
        },
        _end_time: {
          oneof: ['end_time']
        },
        _is_refered: {
          oneof: ['is_refered']
        },
        _unlimited: {
          oneof: ['unlimited']
        }
      },
      fields: {
        sync_data_type: {
          type: 'SyncDataTypeEnum',
          id: 1
        },
        search_after: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        count: {
          type: 'int32',
          id: 3
        },
        product_type_list: {
          rule: 'repeated',
          type: 'ProductTypeEnum',
          id: 4
        },
        local_version: {
          type: 'string',
          id: 5,
          options: {
            proto3_optional: true
          }
        },
        start_time: {
          type: 'string',
          id: 6,
          options: {
            proto3_optional: true
          }
        },
        end_time: {
          type: 'string',
          id: 7,
          options: {
            proto3_optional: true
          }
        },
        is_refered: {
          type: 'bool',
          id: 8,
          options: {
            proto3_optional: true
          }
        },
        unlimited: {
          type: 'bool',
          id: 9,
          options: {
            proto3_optional: true
          }
        }
      }
    },
    bdm_bds_bds_api_base_data_sync_data_scan_response: {
      oneofs: {
        _base_response: {
          oneof: ['base_response']
        },
        _search_after: {
          oneof: ['search_after']
        },
        _data: {
          oneof: ['data']
        }
      },
      fields: {
        base_response: {
          type: 'BaseResponseStruct',
          id: 1,
          options: {
            proto3_optional: true
          }
        },
        search_after: {
          type: 'string',
          id: 2,
          options: {
            proto3_optional: true
          }
        },
        quote_list: {
          rule: 'repeated',
          type: 'QuoteSyncStruct',
          id: 3
        },
        quote_draft_message_list: {
          rule: 'repeated',
          type: 'QuoteDraftMessageSyncStruct',
          id: 4
        },
        quote_draft_detail_list: {
          rule: 'repeated',
          type: 'QuoteDraftDetailSyncStruct',
          id: 5
        },
        deal_info_list: {
          rule: 'repeated',
          type: 'DealInfoSyncStruct',
          id: 6
        },
        quote_detail_list: {
          rule: 'repeated',
          type: 'QuoteDetailStruct',
          id: 7
        },
        data: {
          type: 'bytes',
          id: 8,
          options: {
            proto3_optional: true
          }
        }
      }
    }
  }
};
