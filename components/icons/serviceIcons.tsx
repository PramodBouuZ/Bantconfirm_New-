import React from 'react';
import { CloudIcon } from './CloudIcon';
import { PhoneIcon } from './PhoneIcon';
import { ShieldIcon } from './ShieldIcon';
import { GlobeIcon } from './GlobeIcon';
import { UsersIcon } from './UsersIcon';
import { OfficeIcon } from './OfficeIcon';
import { BriefcaseIcon } from './BriefcaseIcon';
import { DocumentIcon } from './DocumentIcon';
import { CodeIcon } from './CodeIcon';
import { ChatIcon } from './ChatIcon';


export const SERVICE_ICONS: { [key: string]: React.FC } = {
  Cloud: CloudIcon,
  Phone: PhoneIcon,
  Shield: ShieldIcon,
  Globe: GlobeIcon,
  Users: UsersIcon,
  Office: OfficeIcon,
  Briefcase: BriefcaseIcon,
  Document: DocumentIcon,
  Code: CodeIcon,
  Chat: ChatIcon,
};

export const SERVICE_ICON_NAMES = Object.keys(SERVICE_ICONS);