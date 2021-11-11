import { FC, useState } from 'react';
import { Popover, Tooltip } from 'antd';
import Button from 'antd-button-color';
import {
  ExclamationCircleOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { Instance } from '../../../../utils';
import { useApplyInstanceMutation } from '../../../../generated-types';
import { setInstanceRunning } from '../../../../utilsLogic';

export interface IRowInstanceActionsPersistentProps {
  extended: boolean;
  instance: Instance;
}

const RowInstanceActionsPersistent: FC<IRowInstanceActionsPersistentProps> = ({
  ...props
}) => {
  const { extended, instance } = props;

  const { status } = instance;

  const font22px = { fontSize: '22px' };

  const [disabled, setDisabled] = useState(false);

  const [applyInstanceMutation] = useApplyInstanceMutation();

  const mutateInstanceStatus = async (running: boolean) => {
    if (!disabled) {
      setDisabled(true);
      try {
        const result = await setInstanceRunning(
          running,
          instance,
          applyInstanceMutation
        );
        if (result) setTimeout(setDisabled, 400, false);
      } catch {
        // TODO: properly handle errors
      }
    }
  };

  return status === 'VmiReady' ? (
    <Tooltip placement="top" title={'Pause'}>
      <Button
        loading={disabled}
        className={`hidden ${
          extended ? 'sm:block' : 'xs:block'
        } flex items-center`}
        type="warning"
        with="link"
        shape="circle"
        size="middle"
        disabled={disabled}
        icon={
          <PauseCircleOutlined
            className={'flex justify-center items-center'}
            style={font22px}
          />
        }
        onClick={() => mutateInstanceStatus(false)}
      />
    </Tooltip>
  ) : status === 'VmiOff' ? (
    <Tooltip placement="top" title={'Start'}>
      <Button
        loading={disabled}
        className={`hidden ${extended ? 'sm:block' : 'xs:block'} py-0`}
        type="success"
        with="link"
        shape="circle"
        size="middle"
        disabled={disabled}
        icon={
          <PlayCircleOutlined
            className={'flex justify-center items-center'}
            style={font22px}
          />
        }
        onClick={() => mutateInstanceStatus(true)}
      />
    </Tooltip>
  ) : (
    <Popover
      placement="top"
      title={'No Actions Available'}
      content={'Current instance Status: ' + status}
    >
      <div className="cursor-not-allowed">
        <Button
          className={`hidden pointer-events-none ${
            extended ? 'sm:block' : 'xs:block'
          } py-0`}
          type="primary"
          with="link"
          shape="circle"
          size="middle"
          disabled={true}
          icon={
            <ExclamationCircleOutlined
              className={'flex justify-center items-center'}
              style={font22px}
            />
          }
        />
      </div>
    </Popover>
  );
};

export default RowInstanceActionsPersistent;
