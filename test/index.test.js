/* eslint-env mocha */

const chai = require('chai')
const expect = chai.expect

const { isPlainObject, isArray, isEqual } = require('lodash')
const Seneca = require('seneca')
const MergeValidatePackage = require('../index')

const Mock = require('./mocks')
describe('Merge Validate Package Test', () => {
  let mergeValidate = null

  before(() => {
    return new Promise((resolve, reject) => {
      try {
        mergeValidate = MergeValidatePackage(Seneca())
        resolve(null)
      } catch (err) {
        reject(err)
      }
    })
  })

  it('Expect mergeValidate instance isn\'t null', () => {
    return new Promise((resolve, reject) => {
      try {
        expect(mergeValidate).not.be.equal(null)
        resolve(null)
      } catch (err) {
        reject(err)
      }
    })
  })

  it('Expect exists validate property in MergeValidatePackage Lib', () => {
    return new Promise((resolve, reject) => {
      try {
        expect(!!mergeValidate.validate).to.be.equal(true)
        resolve(null)
      } catch (err) {
        reject(err)
      }
    })
  })

  it('Expect validate property is a valid function in MergeValidatePackage Lib', () => {
    return new Promise((resolve, reject) => {
      try {
        expect(typeof mergeValidate.validate).to.be.equal('function')
        resolve(null)
      } catch (err) {
        reject(err)
      }
    })
  })

  it('Expect exists Joi property in MergeValidatePackage Lib', () => {
    return new Promise((resolve, reject) => {
      try {
        expect(!!mergeValidate.Joi).to.be.equal(true)
        resolve(null)
      } catch (err) {
        reject(err)
      }
    })
  })

  it('Expect exists Joi property is a valid object handler of Hapi/Joi', () => {
    return new Promise((resolve, reject) => {
      try {
        expect(!!mergeValidate.Joi.isJoi).to.be.equal(true)
        resolve(null)
      } catch (err) {
        reject(err)
      }
    })
  })

  it('Expect not validate params without options', () => {
    return new Promise((resolve, reject) => {
      try {
        mergeValidate.validate({
          args: {},
          schema: Mock.schema,
          pick: [ 'name' ]
        })
          .catch((err) => {
            expect(typeof err).to.be.equal('object')
            expect(err.status).to.be.equal(false)
            expect(typeof err.message).to.be.equal('object')
            expect(typeof err.message).to.be.equal('object')
            expect(err.message.name).to.be.equal('ValidationError')
            resolve(null)
          })
      } catch (err) {
        reject(err)
      }
    })
  })

  it('Expect validate params without options', () => {
    return new Promise((resolve, reject) => {
      try {
        const args = { name: 'Btime' }
        mergeValidate.validate({
          args,
          schema: Mock.schema,
          pick: [ 'name' ]
        })
          .then((params) => {
            expect(typeof params).to.be.equal('object')
            expect(Object.keys(params).length).to.be.equal(1)
            expect(params.name).to.be.equal(args.name)
            return resolve(null)
          })
          .catch(reject)
      } catch (err) {
        reject(err)
      }
    })
  })

  it('Expect validate params with options', () => {
    return new Promise((resolve, reject) => {
      try {
        mergeValidate.validate(Mock)
          .then((params) => {
            expect(Object.keys(params).length).to.be.equal(2)
            expect(params.name).to.be.equal(Mock.args.name)
            expect(isPlainObject(params.requestOptions)).to.be.equal(true)
            expect(isArray(params.requestOptions.fields)).to.be.equal(true)
            expect(
              isEqual(
                params.requestOptions.fields,
                Mock.args.requestOptions.fields)
            ).to.be.equal(true)
            return resolve(null)
          })
          .catch(reject)
      } catch (err) {
        reject(err)
      }
    })
  })
})
