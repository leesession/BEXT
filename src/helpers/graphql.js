import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:5555/graphql' }),
  cache: new InMemoryCache(),
});

const ALL_TOPICS = gql`
query{
  allTopics{
    address
    creatorAddress
    name
    options
    blockNum
    status
    resultIdx
    qtumAmount
    botAmount
  }
}
`;

const ALL_ORACLES = gql`
  query {
    allOracles {
      token
      address
      topicAddress
      status
      name
      options
      optionIdxs
      resultIdx
      amounts
      endBlock
    }
  }
`;

const ORACLES_BY_ADDRESS = gql`
  query AllOracles($topicAddress: String) {
    allOracles(filter: {
      topicAddress: $topicAddress
    }) {
      topicAddress
      token
      name
      status
      options
      optionIdxs
      resultIdx
      amounts
      endBlock
    }
  }
`;

export function queryAllTopics() {
  return client.query({ query: ALL_TOPICS }).then((res) => {
    const queryName = 'allTopics';
    const queryData = res.data[queryName].map((entry) => ({
      address: entry.address,
      creatorAddress: entry.creatorAddress,
      name: entry.name,
      options: entry.options,
      bettingEndBlock: entry.blockNum,
      status: entry.status,
      resultIdx: entry.resultIdx,
      qtumAmount: entry.qtumAmount,
      botAmount: entry.botAmount,
      oracles: entry.oracles,
    }));

    return queryData;
  });
}

export function queryAllOracles() {
  return client.query({
    query: ALL_ORACLES,
  }).then((res) => {
    const queryName = 'allOracles';
    const queryData = res.data[queryName].map((entry) => ({
      token: entry.token,
      address: entry.address,
      topicAddress: entry.topicAddress,
      status: entry.status,
      name: entry.name,
      options: entry.options,
      optionIdxs: entry.optionIdxs,
      resultIdx: entry.resultIdx,
      amounts: entry.amounts,
      endBlock: entry.endBlock,
    }));

    return queryData;
  });
}