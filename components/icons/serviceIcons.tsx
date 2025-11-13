import React from 'react';
import { CloudIcon } from './CloudIcon';
import { PhoneIcon } from './PhoneIcon';
import { ShieldIcon } from './ShieldIcon';
import { GlobeIcon } from './GlobeIcon';

export const SERVICE_ICONS: { [key: string]: React.FC } = {
  Cloud: CloudIcon,
  Phone: PhoneIcon,
  Shield: ShieldIcon,
  Globe: GlobeIcon,
};

export const SERVICE_ICON_NAMES = Object.keys(SERVICE_ICONS);
