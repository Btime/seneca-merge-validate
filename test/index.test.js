/* eslint-env mocha */

const { expect } = require('chai')

const Mock = require('./mocks')
const Seneca = require('seneca')
const MergeValidatePackage = require('../index')
const { isPlainObject, isArray, isEqual } = require('lodash')

describe('Merge Validate Package Test', () => {
  let mergeValidate = null

  before(async () => {
    try {
      mergeValidate = await MergeValidatePackage(Seneca())
    } catch (err) {
      throw err
    }
  })

  it('Expect mergeValidate instance isn\'t null', () => {
    expect(mergeValidate).not.be.equal(null)
  })

  it('Expect exists validate property in MergeValidatePackage Lib', () => {
    expect(!!mergeValidate.validate).to.be.equal(true)
  })

  it('Expect the validate property to be a function in MergeValidatePackage Lib',
    () => {
      expect(typeof mergeValidate.validate).to.be.equal('function')
    })

  it('Expect exists Joi property in MergeValidatePackage Lib', () => {
    expect(!!mergeValidate.Joi).to.be.equal(true)
  })

  it('Expect exists Joi property is a valid object handler of Hapi/Joi', () => {
    expect(!!mergeValidate.Joi.isJoi).to.be.equal(true)
  })

  it('Expect to validate args with request options', async () => {
    const response = await mergeValidate.validate(Mock)

    expect(Object.keys(response).length).to.be.equal(2)
    expect(response.id).to.be.equal(Mock.args.id)
    expect(isPlainObject(response.requestOptions)).to.be.equal(true)
    expect(isArray(response.requestOptions.fields)).to.be.equal(true)
    expect(
      isEqual(response.requestOptions.fields, Mock.args.requestOptions.fields)
    ).to.be.equal(true)
  })

  it('Expect failure when a specified language is not supported', async () => {
    try {
      const response = await mergeValidate.validate(Mock.unsupportedLanguage)
      expect(response).to.be.equal(undefined)
    } catch (err) {
      expect(typeof err).to.be.equal('object')
      expect(err.status).to.be.equal(false)
      expect(typeof err.errors).to.be.equal('object')
      expect(err.errors[0]).to.have.property('code')
      expect(typeof err.errors[0].code).to.be.equal('string')
      expect(err.errors[0].code).to.be.equal('ITN-001')
      expect(err.errors[0]).to.have.property('path')
      expect(err.errors[0].path).to.be.equal(null)
      expect(err.errors[0]).to.have.property('message')
      expect(typeof err.errors[0].message).to.be.equal('string')
    }
  })

  it('Expect to use raw language object when the option is not a string',
    async () => {
      const response = await mergeValidate.validate(Mock.rawLanguageOption)
      expect(Object.keys(response).length).to.be.equal(2)
      expect(response.name).to.be.equal(Mock.rawLanguageOption.args.name)
    })

  it('Expect to throw errors in the specified language, when supported',
    async () => {
      const EXPECTED_ERROR_COUNT = 2

      try {
        const response = await mergeValidate.validate(Mock.errorsInSupportedLanguage)
        expect(response).to.be.equal(undefined)
      } catch (err) {
        expect(typeof err).to.be.equal('object')
        expect(err.status).to.be.equal(false)
        expect(Array.isArray(err.errors)).to.be.equal(true)
        expect(err.errors[0].code).to.be.equal('CUS-503')
        expect(err.errors[0].path).to.be.equal('name')
        expect(err.errors[1].code).to.be.equal('CUS-503')
        expect(err.errors[1].path).to.be.equal('address')
        expect(err.errors.length).to.be.equal(EXPECTED_ERROR_COUNT)
      }
    })
})
