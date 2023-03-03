import { SystemStyleObject } from '@chakra-ui/react';
import { NAVBAR_HEIGHT } from '~/consts/components';

type TStyle = { page: SystemStyleObject };

const styles: TStyle = {
  page: {
    width: '100%',
    minH: `calc(100vh - ${NAVBAR_HEIGHT}rem)`,
    p: {
      base: '20px',
      md: '40px',
      xl: '80px 100px',
    },
  },
};

export default styles;
