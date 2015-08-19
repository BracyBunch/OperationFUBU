var _ = require('lodash');
var Promise = require('bluebird');
var db = require('../db');

/**
 * Generates a function to relate two nodes
 * @param  {String}  target_label Label of the target node
 * @param  {String}  rel_name     Name of the relationship
 * @param  {String}  rel_label    Label of the start node
 * @param  {Boolean} reverse      If true swaps the direction of the relationship
 * @return {Function}
 */
var add_rel_generator = function(rel_name, reverse, when_complete) {
  reverse = (reverse === undefined || typeof reverse !=='boolean') ? false : reverse;

  /**
   * Relates two nodes
   * @param  {Integer|Object} target Node or id of target
   * @param  {Integer|Object} rel    Node or id of start
   * @return {Promise}
   */
  return function(target, rel) {
    if (reverse) {
      var temp = rel;
      rel = target;
      target = temp;
    }

    return db.has_rel(rel.id || rel, rel_name, target.id || target).then(function(exists) {
      if (exists) throw new Error(target + ' already has ' + rel + ' as ' + rel_name);

      return db.relate(rel, rel_name, target).then(function() {
        if (when_complete) when_complete(target, rel);
        return true;
      });
    });
  };
};

/**
 * Generates a function to relate a node to an array of nodes
 * @param {Function}  add_rel Function generated by add_rel_generator
 * @return {Function}
 */
var add_rels_generator = function(add_rel) {
  /**
   * Relates a node to array of nodes
   * @param  {Integer|Object} target Node or id of target
   * @param  {Integer|Object} rels   Node or id of start
   * @return {Promise}
   */
  return function(target, rels) {
    var calls = [];

    rels.forEach(function(rel) {
      calls.push(add_rel(target, rel));
    });

    return Promise.all(calls);
  };
};

/**
 * Generates a function that removes fields not listed in model.public_fields
 * @param  {Object} model
 * @return {Function}
 */
var clean_generator = function(model) {
  /**
   * Remove fields not listed in model.public_fields
   * @param  {Object} instance Model instance
   * @return {Object}          Cleaned model instance
   */
  return function(instance) {
    return _.pick(instance, model.public_fields);
  };
};

module.exports = {
  'add_rel_generator': add_rel_generator,
  'add_rels_generator': add_rels_generator,
  'clean_generator': clean_generator
};
