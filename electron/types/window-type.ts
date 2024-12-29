import { BasicWindow } from 'app/windows/models/basic-window';
import { NormalWindow } from 'app/windows/models/normal-window';
import { SpecialWindow } from 'app/windows/models/special-window';

export type WindowInstance = NormalWindow | SpecialWindow | BasicWindow;
