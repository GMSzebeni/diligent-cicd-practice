import { validateAddParams, validateFindByStatusParam, validateFindById, validateCompleteParams } from "./validate";

describe('validateAddParams', () => {
  it('should pass and return with the original params with single string', () => {
    const params = ['Todo'];
    const expected = ['Todo'];
    
    const current = validateAddParams(params);

    expect(current).toStrictEqual(expected);
  })

  it('should pass and return with the original params with single string separated with spaces', () => {
    const params = ['Todo Item'];
    const expected = ['Todo Item'];
    
    const current = validateAddParams(params);

    expect(current).toStrictEqual(expected);
  })

  it('should throw when multiple strings given', () => {
    const params = ['Todo Item', 'Other string'];
    
    expect(() => validateAddParams(params))
      .toThrow('Give a title as the only parameter in parenthesis.');
  })

  it('should throw when no params given.', () => {
    const params = [];
    
    expect(() => validateAddParams(params))
      .toThrow('Give a title as the only parameter in parenthesis.');
  })

  it('should throw when the param is not a string', () => {
    const params = [5];
    
    expect(() => validateAddParams(params))
      .toThrow('The title must be a non zero length string.');
  })

  it('should throw when the param is a zero length string', () => {
    const params = [''];
    
    expect(() => validateAddParams(params))
      .toThrow('The title must be a non zero length string.');
  })
})

describe('validateFindByStatusParam', () => {
  it('should pass and return with the original params with single string', () => {
    const params1 = ['done'];
    const expected1 = 'done';
    const params2 = ['not-done'];
    const expected2 = 'not-done';
    
    const current1 = validateFindByStatusParam(params1);
    const current2 = validateFindByStatusParam(params2);

    expect(current1).toStrictEqual(expected1);
    expect(current2).toStrictEqual(expected2);
  })

  it('should throw when multiple strings given', () => {
    const params = ['done', 'Other string'];
    
    expect(() => validateFindByStatusParam(params))
      .toThrow('Give a status as the only parameter.');
  })

  it('should throw when no params given.', () => {
    const params = [];
    
    expect(() => validateFindByStatusParam(params))
      .toThrow('Give a status as the only parameter.');
  })

  it('should throw when the param is not "done" or "not-done"', () => {
    const params = ['invalid-string'];
    
    expect(() => validateFindByStatusParam(params))
      .toThrow('Invalid status. Use "done" or "not-done".');
  })
})
describe('validateFindById', () => {
    
  it('should return the ID when a valid numeric value is provided', () => {
      const validId = 5;
      const result = validateFindById(validId);
      expect(result).toBe(validId);
  });

  it('should throw an error when NaN is provided', () => {
      
      expect(() => validateFindById(NaN)).toThrow('The ID must be a numeric value.');
  });

  it('should throw an error when null is provided', () => {
      
      expect(() => validateFindById(null)).toThrow('The ID must be a numeric value.');
  });

  it('should throw an error when undefined is provided', () => {
      
      expect(() => validateFindById(undefined)).toThrow('The ID must be a numeric value.');
  });

  it('should throw an error when an object is provided', () => {
      
      expect(() => validateFindById({})).toThrow('The ID must be a numeric value.');
  });

  it('should throw an error when an array is provided', () => {
     
      expect(() => validateFindById([])).toThrow('The ID must be a numeric value.');
  });
});

describe('validateCompleteParams', () => {
  it('should return with the given param if its validated', () => {
    const param1 = 1;
    const expected1 = 1;
    const param2 = 2;
    const expected2 = 2;
    
    const current1 = validateCompleteParams(param1);
    const current2 = validateCompleteParams(param2);

    expect(current1).toStrictEqual(expected1);
    expect(current2).toStrictEqual(expected2);
  });

  it('should throw error when param is null', () => {
    const param = null;

    expect(() => validateCompleteParams(param))
      .toThrow('Id is required.');
  });

  it('should throw error when param is not a number', () => {
    const param1 = "2two";
    const param2 = true;

    expect(() => validateCompleteParams(param1))
      .toThrow('Id must be a numeric type.');

      expect(() => validateCompleteParams(param2))
      .toThrow('Id must be a numeric type.');
  })
})