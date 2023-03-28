import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { LockOutlined, SafetyOutlined, UnlockFilled } from '@ant-design/icons';
import ProTable from '@ferlab/ui/core/components/ProTable';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import useQueryBuilderState, {
  addQuery,
} from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { IQueryConfig, IQueryResults, TQueryConfigCb } from '@ferlab/ui/core/graphql/types';
import { Tag, Tooltip } from 'antd';
import { INDEXES } from 'graphql/constants';
import {
  FileAccessType,
  IFileEntity,
  IFileStudyEntity,
  ITableFileEntity,
} from 'graphql/files/models';
import SetsManagementDropdown from 'views/DataExploration/components/SetsManagementDropdown';
import {
  DATA_EXPLORATION_QB_ID,
  DATA_FILES_SAVED_SETS_FIELD,
  DEFAULT_PAGE_SIZE,
  SCROLL_WRAPPER_ID,
} from 'views/DataExploration/utils/constant';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import { FENCE_CONNECTION_STATUSES } from 'common/fenceTypes';
import { SetType } from 'services/api/savedSet/models';
import { fetchTsvReport } from 'store/report/thunks';
import { useUser } from 'store/user';
import { updateUserConfig } from 'store/user/thunks';
import { userHasAccessToFile } from 'utils/dataFiles';
import { formatFileSize } from 'utils/formatFileSize';
import { formatQuerySortList, scrollToTop } from 'utils/helper';
import { STATIC_ROUTES } from 'utils/routes';
import { getProTableDictionary } from 'utils/translation';

import styles from './index.module.scss';

interface OwnProps {
  results: IQueryResults<IFileEntity[]>;
  setQueryConfig: TQueryConfigCb;
  queryConfig: IQueryConfig;
  sqon?: ISqonGroupFilter;
}

const getDefaultColumns = (): ProColumnType[] => [
  {
    key: 'file_id',
    title: 'File ID',
    dataIndex: 'file_id',
    sorter: { multiple: 1 },
  },
  {
    key: 'study.study_code',
    title: 'Study',
    sorter: {
      multiple: 1,
    },
    dataIndex: 'study',
    render: (study: IFileStudyEntity) => study.study_code || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'data_category',
    title: 'Data Category',
    sorter: { multiple: 1 },
    dataIndex: 'data_category',
    render: (data_category: string) => data_category || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'data_type',
    title: 'Data Type',
    dataIndex: 'data_type',
    sorter: { multiple: 1 },
    render: (data_type: string) => data_type || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'sequencing_experiment.experiment_strategy',
    title: 'Experimental Strategy',
    sorter: { multiple: 1 },
    render: (record: IFileEntity) =>
      record.sequencing_experiment
        ? record.sequencing_experiment.hits?.edges
          .map((edge) => edge.node.experiment_strategy)
          .join(', ')
        : TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'file_format',
    title: 'Format',
    dataIndex: 'file_format',
    sorter: { multiple: 1 },
  },
  {
    key: 'size',
    title: 'Size',
    dataIndex: 'size',
    sorter: { multiple: 1 },
    render: (size: number) => formatFileSize(size, { output: 'string' }),
  },
  {
    key: 'nb_participants',
    title: 'Participants',
    sorter: { multiple: 1 },
    render: (record: IFileEntity) => {
      const nb_participants = record?.nb_participants || 0;
      return nb_participants ? (
        <Link
          to={STATIC_ROUTES.DATA_EXPLORATION_PARTICIPANTS}
          onClick={() =>
            addQuery({
              queryBuilderId: DATA_EXPLORATION_QB_ID,
              query: generateQuery({
                newFilters: [
                  generateValueFilter({
                    field: 'file_id',
                    value: [record.file_id],
                    index: INDEXES.FILES,
                  }),
                ],
              }),
              setAsActive: true,
            })
          }
        >
          {nb_participants}
        </Link>
      ) : (
        nb_participants
      );
    },
  },
  {
    key: 'nb_biospecimens',
    title: 'Biospecimens',
    sorter: { multiple: 1 },
    render: (record: IFileEntity) => {
      const nb_biospecimens = record?.nb_biospecimens || 0;
      return nb_biospecimens ? (
        <Link
          to={STATIC_ROUTES.DATA_EXPLORATION_BIOSPECIMENS}
          onClick={() =>
            addQuery({
              queryBuilderId: DATA_EXPLORATION_QB_ID,
              query: generateQuery({
                newFilters: [
                  generateValueFilter({
                    field: 'file_id',
                    value: [record.file_id],
                    index: INDEXES.FILES,
                  }),
                ],
              }),
              setAsActive: true,
            })
          }
        >
          {nb_biospecimens}
        </Link>
      ) : (
        nb_biospecimens
      );
    },
  },
  {
    key: 'external_id',
    title: 'External File ID',
    dataIndex: 'external_id',
    defaultHidden: true,
    sorter: { multiple: 1 },
    render: (externalId: string) => externalId || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'file_name',
    title: 'File Name',
    dataIndex: 'file_name',
    defaultHidden: true,
    sorter: { multiple: 1 },
  },
  {
    key: 'platform',
    title: 'Platform',
    dataIndex: 'platform',
    defaultHidden: true,
    sorter: { multiple: 1 },
    render: () => TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'repository',
    title: 'Repository',
    dataIndex: 'repository',
    defaultHidden: true,
    sorter: { multiple: 1 },
  },
  {
    key: 'acl',
    title: 'ACL',
    dataIndex: 'acl',
    defaultHidden: true,
    sorter: { multiple: 1 },
    render: (acl: string[]) => acl?.join(', ') || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'latest_did',
    title: 'Latest DID',
    dataIndex: 'latest_did',
    defaultHidden: true,
    sorter: { multiple: 1 },
    render: () => TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'access_urls',
    title: 'Access URL',
    dataIndex: 'access_urls',
    defaultHidden: true,
    sorter: { multiple: 1 },
  },
];

const DataFilesTab = ({ results, setQueryConfig, queryConfig, sqon }: OwnProps) => {
  const dispatch = useDispatch();
  const { userInfo } = useUser();
  const { activeQuery } = useQueryBuilderState(DATA_EXPLORATION_QB_ID);
  const [selectedAllResults, setSelectedAllResults] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<ITableFileEntity[]>([]);

  useEffect(() => {
    if (selectedKeys.length) {
      setSelectedKeys([]);
      setSelectedRows([]);
    }
    // eslint-disable-next-line
  }, [JSON.stringify(activeQuery)]);

  const getCurrentSqon = (): any =>
    selectedAllResults || !selectedKeys.length
      ? sqon
      : generateQuery({
        newFilters: [
          generateValueFilter({
            field: DATA_FILES_SAVED_SETS_FIELD,
            index: INDEXES.FILES,
            value: selectedRows.map((row) => row[DATA_FILES_SAVED_SETS_FIELD]),
          }),
        ],
      });

  return (
    <>
      <ProTable<ITableFileEntity>
        tableId="datafiles_table"
        columns={getDefaultColumns()}
        initialSelectedKey={selectedKeys}
        wrapperClassName={styles.dataFilesTabWrapper}
        loading={results.loading}
        initialColumnState={userInfo?.config.data_exploration?.tables?.datafiles?.columns}
        enableRowSelection={true}
        showSorterTooltip={false}
        onChange={({ current, pageSize }, _, sorter) =>
          setQueryConfig({
            pageIndex: current!,
            size: pageSize!,
            sort: formatQuerySortList(sorter),
          })
        }
        headerConfig={{
          itemCount: {
            pageIndex: queryConfig.pageIndex,
            pageSize: queryConfig.size,
            total: results.total,
          },
          enableColumnSort: true,
          enableTableExport: true,
          onSelectAllResultsChange: setSelectedAllResults,
          onSelectedRowsChange: (keys, rows) => {
            setSelectedKeys(keys);
            setSelectedRows(rows);
          },
          onTableExportClick: () =>
            dispatch(
              fetchTsvReport({
                columnStates: userInfo?.config.data_exploration?.tables?.datafiles?.columns,
                columns: getDefaultColumns(),
                index: INDEXES.FILES,
                sqon: getCurrentSqon(),
              }),
            ),
          onColumnSortChange: (newState) =>
            dispatch(
              updateUserConfig({
                data_exploration: {
                  tables: {
                    datafiles: {
                      columns: newState,
                    },
                  },
                },
              }),
            ),
          extra: [
            <SetsManagementDropdown
              idField="fhir_id"
              results={results}
              sqon={getCurrentSqon()}
              selectedAllResults={selectedAllResults}
              type={SetType.FILES}
              selectedKeys={selectedKeys}
              key="file-set-management"
            />,
          ],
        }}
        bordered
        size="small"
        pagination={{
          current: queryConfig.pageIndex,
          pageSize: queryConfig.size,
          defaultPageSize: DEFAULT_PAGE_SIZE,
          total: results.total,
          onChange: () => scrollToTop(SCROLL_WRAPPER_ID),
        }}
        dataSource={results.data.map((i) => ({ ...i, key: i.file_id }))}
        dictionary={getProTableDictionary()}
      />
    </>
  );
};

export default DataFilesTab;
