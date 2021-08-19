import type { FunctionComponent } from 'react';
import React from 'react';
import type { ChildOption, ChildOptionValue } from '../services/settings.service';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import GetAppIcon from '@material-ui/icons/GetApp';
import NumberFormat from 'react-number-format';
import css from './setting-child-option.widget.css';
import type { NumberFormatValues } from 'react-number-format';
import { TextField, InputAdornment, Typography } from '@material-ui/core';

export type SettingChildOptionProps = { childOption?: ChildOption; onChange: (value: ChildOptionValue) => void };

export const SettingChildOption: FunctionComponent<SettingChildOptionProps> = ({
  childOption,
  onChange
}: SettingChildOptionProps) => {
  switch (childOption?.id) {
    case 're-list-threshold':
      return (
        <ListItem className={css.listItem}>
          <ListItemIcon className={css.inVisibleIcon}>
            <GetAppIcon />
          </ListItemIcon>
          <div className={css.reListRoot}>
            <Typography variant="body2" color="textSecondary">
              Spieler neu listen, wenn das Angebot weniger als
            </Typography>

            <TextField
              className={css.reListThresholdInput}
              label="Grenze"
              defaultValue={childOption.value}
              size="small"
              variant="outlined"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onChange(Number(event.target.value));
              }}
              InputProps={{
                inputComponent: ReListThresholdNumberFormat as any,
                endAdornment: (
                  <InputAdornment className={css.percentInputAdornment} position="end">
                    %
                  </InputAdornment>
                )
              }}
            />
            <Typography variant="body2" color="textSecondary">
              über dem Marktwert liegt
            </Typography>
          </div>
        </ListItem>
      );
    default:
      return <></>;
  }
};

interface ReListThresholdNumberFormatProps {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

function ReListThresholdNumberFormat(props: ReListThresholdNumberFormatProps) {
  const { inputRef, onChange, ...other }: ReListThresholdNumberFormatProps = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      decimalScale={2}
      decimalSeparator=","
      thousandSeparator="."
      fixedDecimalScale
      onValueChange={(values: NumberFormatValues) => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        });
      }}
    />
  );
}
