import intl from 'react-intl-universal';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
} from 'react-router-dom';
import Empty from '@ferlab/ui/core/components/Empty';
import MaintenancePage from '@ferlab/ui/core/pages/MaintenancePage';
import loadable from '@loadable/component';
import { useKeycloak } from '@react-keycloak/web';
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import frFR from 'antd/lib/locale/fr_FR';
import { getEnvVarByKey } from 'helpers/EnvVariables';
import AuthMiddleware from 'middleware/AuthMiddleware';
import ProtectedRoute from 'ProtectedRoute';
import ApolloProvider from 'provider/ApolloProvider';
import ContextProvider from 'provider/ContextProvider';
import { GraphqlBackend } from 'provider/types';
import ErrorPage from 'views/Error';
import FakeStorybook from 'views/FakeStorybook';
import Login from 'views/Login';
import ParticipantEntity from 'views/ParticipantEntity';

import { LANG } from 'common/constants';
import ErrorBoundary from 'components/ErrorBoundary';
import PageLayout from 'components/Layout';
import SideImageLayout from 'components/Layout/SideImage';
import GradientAccent from 'components/uiKit/GradientAccent';
import Spinner from 'components/uiKit/Spinner';
import NotificationContextHolder from 'components/utils/NotificationContextHolder';
import { useLang } from 'store/global';
import { DYNAMIC_ROUTES, STATIC_ROUTES } from 'utils/routes';

const loadableProps = { fallback: <Spinner size="large" /> };
const Dashboard = loadable(() => import('views/Dashboard'), loadableProps);
const Studies = loadable(() => import('views/Studies'), loadableProps);
const DataExploration = loadable(() => import('views/DataExploration'), loadableProps);
const Variants = loadable(() => import('views/Variants'), loadableProps);
const VariantEntity = loadable(() => import('views/VariantEntity'), loadableProps);

const App = () => {
  const lang = useLang();
  const { keycloak, initialized } = useKeycloak();
  const keycloakIsReady = keycloak && initialized;

  if (getEnvVarByKey('MAINTENANCE_MODE') === 'true') {
    return (
      <MaintenancePage
        title={intl.get('maintenance.title')}
        subtitle={intl.get('maintenance.subtitle')}
      />
    );
  }

  return (
    <ConfigProvider
      locale={lang === LANG.FR ? frFR : enUS}
      renderEmpty={() => <Empty imageType="grid" />}
    >
      <ApolloProvider backend={GraphqlBackend.ARRANGER}>
        <div className="App" id="appContainer">
          {keycloakIsReady ? (
            <AuthMiddleware>
              <Router>
                <Switch>
                  <Route exact path={STATIC_ROUTES.LOGIN}>
                    <GradientAccent isFixed />
                    <SideImageLayout>
                      <Login />
                    </SideImageLayout>
                  </Route>
                  <Route
                    path={DYNAMIC_ROUTES.ERROR}
                    render={(props: RouteComponentProps<{ status?: any }>) => (
                      <ErrorPage status={props.match.params.status} />
                    )}
                  />
                  <ProtectedRoute exact path={STATIC_ROUTES.DASHBOARD} layout={PageLayout}>
                    <Dashboard />
                  </ProtectedRoute>
                  <ProtectedRoute exact path={STATIC_ROUTES.STUDIES} layout={PageLayout}>
                    <Studies />
                  </ProtectedRoute>
                  <ProtectedRoute exact path={DYNAMIC_ROUTES.DATA_EXPLORATION} layout={PageLayout}>
                    <DataExploration />
                  </ProtectedRoute>
                  <ProtectedRoute
                    exact
                    path={DYNAMIC_ROUTES.PARTICIPANT_ENTITY}
                    layout={PageLayout}
                  >
                    <ParticipantEntity />
                  </ProtectedRoute>
                  <ProtectedRoute exact path={STATIC_ROUTES.VARIANTS} layout={PageLayout}>
                    <Variants />
                  </ProtectedRoute>
                  <ProtectedRoute exact path={DYNAMIC_ROUTES.VARIANT_ENTITY} layout={PageLayout}>
                    <VariantEntity />
                  </ProtectedRoute>
                  <ProtectedRoute exact path={STATIC_ROUTES.FAKE_STORYBOOK} layout={PageLayout}>
                    <FakeStorybook />
                  </ProtectedRoute>
                  <Redirect from="*" to={STATIC_ROUTES.DASHBOARD} />
                </Switch>
                <NotificationContextHolder />
              </Router>
            </AuthMiddleware>
          ) : (
            <Spinner size={'large'} />
          )}
        </div>
      </ApolloProvider>
    </ConfigProvider>
  );
};

const EnhanceApp = () => (
  <ErrorBoundary>
    <ContextProvider>
      <App />
    </ContextProvider>
  </ErrorBoundary>
);

export default EnhanceApp;
