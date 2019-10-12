import { useState } from 'react';

export const use_text_input = (init_val: string) => {
  const [value, set_value] = useState(init_val);
  return {
    value,
    set_value,
    reset: () => set_value(''),
    bind: {
      value,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        set_value(event.target.value);
      }
    }
  };
};
