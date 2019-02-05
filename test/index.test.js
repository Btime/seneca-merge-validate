/* eslint-env mocha */

const { expect } = require('chai')

const Mock = require('./mocks')
const Seneca = require('seneca')
const MergeValidatePackage = require('../index')
const { isPlainObject, isArray, isEqual } = require('lodash')
const { UNSUPPORTED_LANG } = require('joi-language-package/src/errors')

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

  it('Expect validate params with options', () => {
    return new Promise((resolve, reject) => {
      try {
        mergeValidate.validate(Mock)
          .then((params) => {
            expect(Object.keys(params).length).to.be.equal(2)
            expect(params.id).to.be.equal(Mock.args.id)
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

  it('Expect failure when a specified language is not supported', () => {
    return new Promise((resolve, reject) => {
      try {
        mergeValidate.validate(Mock.unsupportedLanguage)
          .catch(err => {
            expect(typeof err).to.be.equal('object')
            expect(err.status).to.be.equal(false)
            expect(typeof err.message).to.be.equal('string')
            expect(err.message).to.be.equal(UNSUPPORTED_LANG)
            return resolve(null)
          })
      } catch (err) {
        return reject(err)
      }
    })
  })

  it('Expect to use raw language object when the option is not a string', () => {
    return new Promise((resolve, reject) => {
      try {
        return mergeValidate.validate(Mock.rawLanguageOption)
          .then(params => {
            expect(Object.keys(params).length).to.be.equal(1)
            expect(params.name).to.be.equal(Mock.rawLanguageOption.args.name)
            return resolve(null)
          })
          .catch(reject)
      } catch (err) {
        return reject(err)
      }
    })
  })

  it('Expect to throw erros in the specified language, when supported', () => {
    return new Promise((resolve, reject) => {
      try {
        const EXPECTED_TERM = 'obrigatório'
        const EXPECTED_ERROR_COUNT = 1

        mergeValidate.validate(Mock.errorsInSupportedLanguage)
          .catch(err => {
            expect(typeof err).to.be.equal('object')
            expect(err.status).to.be.equal(false)
            expect(typeof err.message).to.be.equal('object')
            expect(err.message.name).to.be.equal('ValidationError')
            expect(Array.isArray(err.message.details)).to.be.equal(true)
            expect(err.message.details.length).to.be.equal(EXPECTED_ERROR_COUNT)
            const { message } = err.message.details.splice(-1).pop()
            expect(message).to.include(EXPECTED_TERM)
            return resolve(null)
          })
      } catch (err) {
        return reject(err)
      }
    })
  })
})
