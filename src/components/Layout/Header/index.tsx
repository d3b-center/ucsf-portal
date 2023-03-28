import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import {
  FileSearchOutlined,
  GlobalOutlined,
  HomeOutlined,
  LaptopOutlined,
  LogoutOutlined,
  MailOutlined,
  MessageOutlined,
  ReadOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { DownOutlined } from '@ant-design/icons';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import Gravatar from '@ferlab/ui/core/components/Gravatar';
import { useKeycloak } from '@react-keycloak/web';
import { Dropdown, Menu, PageHeader, Space, Typography } from 'antd';
import cx from 'classnames';
import { getFTEnvVarByKey } from 'helpers/EnvVariables';

import { FT_COMMUNITY, FT_DASHBOARD, FT_EXPLORE_DATA, FT_STUDIES } from 'common/featureToggle';
import { KidsFirstKeycloakTokenParsed } from 'common/tokenTypes';
import { AlterTypes } from 'common/types';
import NotificationBanner from 'components/featureToggle/NotificationBanner';
import LineStyleIcon from 'components/Icons/LineStyleIcon';
import UCSFIcon from 'components/Icons/UCSFIcon';
import HeaderLink from 'components/Layout/Header/HeaderLink';
import headerLinkStyles from 'components/Layout/Header/HeaderLink/index.module.scss';
import styles from 'components/Layout/Header/index.module.scss';
import GradientAccent from 'components/uiKit/GradientAccent';
import { userActions } from 'store/user/slice';
import { STATIC_ROUTES } from 'utils/routes';

const FT_FLAG_KEY = 'SITE_WIDE_BANNER';
const BANNER_TYPE_KEY = FT_FLAG_KEY + '_TYPE';
const BANNER_MSG_KEY = FT_FLAG_KEY + '_MSG';

const Header = () => {
  const dispatch = useDispatch();
  const { keycloak } = useKeycloak();
  const history = useHistory();
  const currentPathName = history.location.pathname;
  const tokenParsed = keycloak.tokenParsed as KidsFirstKeycloakTokenParsed;
  const userInfo = {
    first_name: tokenParsed.preferred_username,
    last_name: '',
    email: tokenParsed.preferred_username,
    keycloak_id: tokenParsed.sub,
  };

  return (
    <>
      <GradientAccent />
      <NotificationBanner
        className={styles.siteWideBanner}
        featureToggleKey={FT_FLAG_KEY}
        type={getFTEnvVarByKey<AlterTypes>(BANNER_TYPE_KEY, 'warning')}
        message={getFTEnvVarByKey(BANNER_MSG_KEY)}
        banner
        closable
      />
      <PageHeader
        title={<UCSFIcon className={styles.logo} />}
        subTitle={
          <nav className={styles.headerList}>
            <HeaderLink
              key="dashboard"
              currentPathName={currentPathName}
              to={STATIC_ROUTES.DASHBOARD}
              icon={<HomeOutlined />}
              title={intl.get('layout.main.menu.dashboard')}
              featureToggleKey={FT_DASHBOARD}
            />
            <HeaderLink
              key="explore-data"
              currentPathName={currentPathName}
              to={[
                STATIC_ROUTES.DATA_EXPLORATION,
                STATIC_ROUTES.DATA_EXPLORATION_SUMMARY,
                STATIC_ROUTES.DATA_EXPLORATION_BIOSPECIMENS,
                STATIC_ROUTES.DATA_EXPLORATION_PARTICIPANTS,
                STATIC_ROUTES.DATA_EXPLORATION_DATAFILES,
              ]}
              icon={<FileSearchOutlined />}
              title={intl.get('layout.main.menu.explore')}
              featureToggleKey={FT_EXPLORE_DATA}
            />
            <HeaderLink
              key="variant-data"
              currentPathName={currentPathName}
              to={[STATIC_ROUTES.VARIANTS]}
              icon={<LineStyleIcon />}
              title={intl.get('layout.main.menu.variants')}
            />
          </nav>
        }
        extra={[
          <Space key={'website'} className={styles.headerLink}>
            <ExternalLink href="https://www.ucsf.edu/" className={styles.headerExternalLink}>
              <GlobalOutlined />
              {intl.get('layout.main.menu.website')}
            </ExternalLink>
          </Space>,
          <Dropdown
            key="user-menu"
            trigger={['click']}
            overlay={
              <Menu
                items={[
                  {
                    key: 'email',
                    disabled: true,
                    label: (
                      <Space size={4} className={styles.userMenuEmail}>
                        <Typography.Text>Signed in with</Typography.Text>
                        <Typography.Text strong>{tokenParsed.preferred_username}</Typography.Text>
                      </Space>
                    ),
                  },
                  {
                    type: 'divider',
                  },
                  {
                    key: 'logout',
                    label: (
                      <Space>
                        <LogoutOutlined />
                        {intl.get('layout.user.menu.logout')}
                      </Space>
                    ),
                    onClick: () => {
                      dispatch(userActions.cleanLogout());
                      window.sessionStorage.clear();
                    },
                  },
                ]}
              />
            }
          >
            <a
              className={cx(styles.userMenuTrigger, styles.menuTrigger)}
              onClick={(e) => e.preventDefault()}
              href=""
            >
              <Gravatar
                circle
                className={styles.userGravatar}
                email={tokenParsed.email || tokenParsed.identity_provider_identity}
              />
              <span className={styles.userName}>{userInfo?.first_name}</span>
              <DownOutlined />
            </a>
          </Dropdown>,
        ]}
        className={styles.mainHeader}
      />
    </>
  );
};

export default Header;
