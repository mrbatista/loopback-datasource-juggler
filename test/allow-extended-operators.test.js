// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-datasource-juggler
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

const DataSource = require('..').DataSource;
const should = require('should');

describe('allowExtendedOperators', () => {

  function createTestModel(connectorSettings, modelSettings) {
    const ds = createTestDataSource(connectorSettings);
    return ds.createModel('TestModel', {value: String}, modelSettings);
  }

  function createTestDataSource(connectorSettings) {
    connectorSettings = connectorSettings || {};
    connectorSettings.connector = {
      initialize: (dataSource, cb) => {
        dataSource.connector = new TestConnector(dataSource);
      },
    };

    return new DataSource(connectorSettings);
  }

  class TestConnector {
    constructor(dataSource) {
    }

    create(model, data, options, callback) {
      callback();
    }

    updateAttributes(model, id, data, options, callback) {
      callback();
    }

    all(model, filter, options, callback) {
      // return the raw "value" query
      var instanceFound = {
        value: filter.where.value,
      };
      callback(null, [instanceFound]);
    }
  }

  describe('connector.settings.allowExtendedOperators', () => {
    context('DAO.find()', () => {
      it('converts extended operators to string value by default', () => {
        const TestModel = createTestModel();
        return TestModel.find(extendedQuery()).then((results) => {
          should(results[0].value).eql('[object Object]');
        });
      });

      it('preserves extended operators with allowExtendedOperators set', () => {
        const TestModel = createTestModel({allowExtendedOperators: true});
        return TestModel.find(extendedQuery()).then((results) => {
          should(results[0].value).eql({$exists: true});
        });
      });

      function extendedQuery() {
        // datasource modifies the query,
        // we have to build a new object for each test
        return {where: {value: {$exists: true}}};
      }
    });

    context('DAO.updateAttributes()', () => {
      it.skip('`options.allowExtendedOperators` override connector settings - disabled', () => {
        const TestModel = createTestModel({allowExtendedOperators: true});
        // There is issue for update data.
        // See https://github.com/strongloop/loopback-connector-mongodb/issues/157
      });

      it.skip('`options.allowExtendedOperators` override connector settings - enabled', () => {
        // Default value for allowExtendedOperators is false
        const TestModel = createTestModel({allowExtendedOperators: false});
      });

      it.skip('`Model.settings.allowExtendedOperators` override connector settings - enabled', () => {
        const TestModel = createTestModel({allowExtendedOperators: false}, {allowExtendedOperators: true});
      });

      it.skip('`Model.settings.allowExtendedOperators` override connector settings - disabled', () => {
        const TestModel = createTestModel({allowExtendedOperators: true}, {allowExtendedOperators: false});
      });
    });
  });

  describe('Model.settings.allowExtendedOperators', () => {
    context('DAO.updateAttributes()', () => {
      it.skip('`options.allowExtendedOperators` override Model settings - disabled', () => {
        const TestModel = createTestModel({}, {allowExtendedOperators: true});
      });

      it.skip('`options.allowExtendedOperators` override Model settings - enabled', () => {
        const TestModel = createTestModel({}, {allowExtendedOperators: false});
      });

      it.skip('`connector.settings.allowExtendedOperators` honor Model settings - enabled', () => {
        const TestModel = createTestModel({allowExtendedOperators: false}, {allowExtendedOperators: true});
      });

      it.skip('`connector.settings.allowExtendedOperators` honor Model settings - disabled', () => {
        const TestModel = createTestModel({allowExtendedOperators: true}, {allowExtendedOperators: false});
      });
    });
  });

  describe('options.allowExtendedOperators', () => {
    context('DAO.updateAttributes()', () => {
      it.skip('`Model.settings.allowExtendedOperators` honor options settings - enabled', () => {
        const TestModel = createTestModel({}, {allowExtendedOperators: false});
      });

      it.skip('`Model.settings.allowExtendedOperators` honor options settings - disabled', () => {
        const TestModel = createTestModel({}, {allowExtendedOperators: true});
      });

      it.skip('`connector.settings.allowExtendedOperators` honor options settings - enabled', () => {
        const TestModel = createTestModel();
      });

      it.skip('`connector.settings.allowExtendedOperators` honor options settings - disabled', () => {
        const TestModel = createTestModel({allowExtendedOperators: true});
      });
    });
  });
});
