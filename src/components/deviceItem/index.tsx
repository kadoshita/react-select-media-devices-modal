import React from 'react';

interface DeviceItemProps {
  name: string;
  value: string;
  style?: React.CSSProperties;
}

const DeviceItem = ({ name, value, style }: DeviceItemProps) => {
  return (
    <option style={style} value={value}>
      {name}
    </option>
  );
};

export default DeviceItem;
