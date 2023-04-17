import intl from 'react-intl-universal';
import { useKeycloak } from '@react-keycloak/web';
import { Button, Space, Typography } from 'antd';

import { REDIRECT_URI_KEY } from 'common/constants';
import USCFLoginIcon from 'components/Icons/USCFLoginIcon';
import useQueryParams from 'hooks/useQueryParams';
import { STATIC_ROUTES } from 'utils/routes';

import styles from './index.module.scss';

const { Title } = Typography;

const Login = (): React.ReactElement => {
  const { keycloak } = useKeycloak();
  const query = useQueryParams();

  const handleSignin = async () => {
    const url = keycloak.createLoginUrl({
      // eslint-disable-next-line max-len
      redirectUri: `${window.location.origin}/${
        query.get(REDIRECT_URI_KEY) || STATIC_ROUTES.DASHBOARD
      }`,
    });
    window.location.assign(url);
  };

  return (
    <div className={styles.loginPageContent}>
      <div className={styles.loginContainer}>
        <Space size={48} direction="vertical" align="center">
          <div className={styles.logoTitleContainer}>
            <USCFLoginIcon width={180} height={180} />
            <Title level={1} className={styles.logotTitle}>
              {intl.get('screen.loginPage.title')}
            </Title>
          </div>
          <div className={styles.loginDescription}>
            <span className={styles.loginDescText}>
              {intl.get('screen.loginPage.accessLargeScale')}
            </span>
          </div>
          <div className={styles.loginButtons}>
            <Button type={'primary'} onClick={handleSignin} size={'large'}>
              {intl.get('screen.loginPage.login')}
            </Button>
          </div>
        </Space>
      </div>
    </div>
  );
};
export default Login;
