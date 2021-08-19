import GetAppIcon from '@material-ui/icons/GetApp';
import GetAppOutlinedIcon from '@material-ui/icons/GetAppOutlined';

import FileCopyIcon from '@material-ui/icons/FileCopy';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';

import RestorePageIcon from '@material-ui/icons/RestorePage';
import RestorePageOutlinedIcon from '@material-ui/icons/RestorePageOutlined';

import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';

import HelpIcon from '@material-ui/icons/Help';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import ExposureIcon from '@material-ui/icons/Exposure';
import ExposureOutlinedIcon from '@material-ui/icons/ExposureOutlined';

import type SvgIcon from '@material-ui/icons/GetAppOutlined';

export type IconSet = { Icon: typeof SvgIcon; CheckedIcon: typeof SvgIcon };
export const iconMap: Record<string, IconSet> = {
  file_download: { Icon: GetAppOutlinedIcon, CheckedIcon: GetAppIcon },
  content_copy: { Icon: FileCopyOutlinedIcon, CheckedIcon: FileCopyIcon },
  sync: { Icon: RestorePageOutlinedIcon, CheckedIcon: RestorePageIcon },
  highlight_off: { Icon: VisibilityOutlinedIcon, CheckedIcon: VisibilityOffIcon },
  trending_up: { Icon: ExposureOutlinedIcon, CheckedIcon: ExposureIcon },
  help: { Icon: HelpOutlineIcon, CheckedIcon: HelpIcon }
};
