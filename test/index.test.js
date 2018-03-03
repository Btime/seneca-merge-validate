import { script } from 'lab'
import { expect } from 'code'
import {
  isPlainObject,
  isArray,
  isEqual
} from 'lodash'
import Seneca from 'seneca'
import MergeValidatePackage from '../index'

const Mock = require('./mocks')
const lab = exports.lab = script()
const describe = lab.describe
const it = lab.it
const before = lab.before

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

  it('Expect mergeValidate instance isn\'t null',
    () => {
      return new Promise((resolve, reject) => {
        try {
          expect(mergeValidate).not.be.equal(null)
          resolve(null)
        } catch (err) {
          reject(err)
        }
      })
    }
  )

  it('Expect exists validate property in MergeValidatePackage Lib',
    () => {
      return new Promise((resolve, reject) => {
        try {
          expect(!!mergeValidate.validate).to.be.equal(true)
          resolve(null)
        } catch (err) {
          reject(err)
        }
      })
    }
  )

  it('Expect validate property is a valid function in MergeValidatePackage Lib',
    () => {
      return new Promise((resolve, reject) => {
        try {
          expect(typeof mergeValidate.validate).to.be.equal('function')
          resolve(null)
        } catch (err) {
          reject(err)
        }
      })
    }
  )

  it('Expect not validate params without options',
    () => {
      return new Promise((resolve, reject) => {
        try {
          mergeValidate.validate({
            args: {},
            schema: Mock.schema,
            pick: ['name']
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
    }
  )

  it('Expect validate params without options',
    () => {
      return new Promise((resolve, reject) => {
        try {
          const args = { name: 'felipebarroscruz' }
          mergeValidate.validate({
            args,
            schema: Mock.schema,
            pick: ['name']
          })
          .then((params) => {
            expect(typeof params).to.be.equal('object')
            expect(Object.keys(params).length).to.be.equal(1)
            expect(params.name).to.be.equal(args.name)
            resolve(null)
          })
          .catch(reject)
        } catch (err) {
          reject(err)
        }
      })
    }
  )

  it('Expect validate params with options',
    () => {
      return new Promise((resolve, reject) => {
        try {
          mergeValidate.validate(Mock)
            .then((params) => {
              expect(Object.keys(params).length).to.be.equal(2)
              expect(params.name).to.be.equal(Mock.args.name)
              expect(isPlainObject(params.options)).to.be.equal(true)
              expect(isArray(params.options.fields)).to.be.equal(true)
              expect(
                isEqual(params.options.fields, Mock.args.options.fields)
              ).to.be.equal(true)
              resolve(null)
            })
            .catch(reject)
        } catch (err) {
          reject(err)
        }
      })
    }
  )
})
