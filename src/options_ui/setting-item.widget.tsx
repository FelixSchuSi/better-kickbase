import type { FunctionComponent } from 'react';
import { useState } from 'react';
import React from 'react';
import type { ChildOptionValue, Setting } from '../services/settings.service';
import Switch from '@material-ui/core/Switch';
import { SettingChildOption } from './setting-child-option.widget';
import css from './setting-item.widget.css';
import { Divider, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@material-ui/core';

export type SettingsItemProps = {
  setting: Setting;
  onChange: (enabled: boolean) => void;
  onChildOptChange: (value: ChildOptionValue) => void;
  index: number;
};

export const SettingItem: FunctionComponent<SettingsItemProps> = ({
  setting,
  onChange,
  onChildOptChange,
  index
}: SettingsItemProps) => {
  if (setting.id === '_' && !setting.enabled) return <></>;
  const [enabled, setEnabled] = useState(setting.enabled);
  const toggleEnabled = () => {
    setEnabled(!enabled);
  };
  const hasChildOpts: boolean = !!setting.childOption;
  return (
    <>
      {index !== 0 ? <Divider /> : ''}
      <ListItem className={`${css.listItem} ${hasChildOpts ? css.listItemWithChildOpt : ''}`}>
        <ListItemIcon>
          <div className="material-icons">{setting.icon}</div>
        </ListItemIcon>
        <ListItemText id={setting.id} primary={setting.title} secondary={setting.label} />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            onChange={() => {
              onChange(!enabled);
              toggleEnabled();
            }}
            checked={setting.enabled}
            inputProps={{ 'aria-labelledby': setting.id }}
          />
        </ListItemSecondaryAction>
      </ListItem>
      <SettingChildOption
        childOption={setting.childOption}
        onChange={(value: ChildOptionValue) => onChildOptChange(value)}
      />
    </>
  );
};
