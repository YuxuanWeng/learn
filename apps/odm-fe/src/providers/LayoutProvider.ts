import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Acceptor } from '@fepkg/services/types/enum';
import { useAuth } from '@/providers/AuthProvider';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { TabEnum, TypeSearchFilter } from '@/pages/Home/type';

export const HomeLayoutContainer = createContainer(() => {
  const { access } = useAuth();
  const [currentInst] = useSearchParams();
  // 从url中解析当前页面属于哪个页签
  const { id = TabEnum.Record } = useParams();
  // 从url中解析当前页面属于哪个机构
  const defInst = currentInst.get('inst');

  // 是否正在配置外发字段
  const [confOpen, setConfOpen] = useState(false);
  // 当前展示的外发机构
  const [current, setCurrent] = useState(defInst === null ? Acceptor.AcceptorWind : (+defInst as Acceptor));
  // 当前展示的页签
  const [activeTab, setActiveTab] = useState(id as TabEnum);
  // 当前机构的筛选条件 —— 变量提升到这里的目的是为了方便切换机构时重置筛选条件
  const [params, setParams] = useImmer<TypeSearchFilter>({});

  return { access, confOpen, params, setParams, setConfOpen, current, setCurrent, activeTab, setActiveTab };
});

export const HomeLayoutProvider = HomeLayoutContainer.Provider;
export const useHomeLayout = HomeLayoutContainer.useContainer;
