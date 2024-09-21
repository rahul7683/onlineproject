import {
    createCategory
} from '../Service/categoryService';
import {
    jest
} from '@jest/globals'


describe("Create category test", () => {

    let categoryData = {
        categoryName: 'TestCategory',
        categoryLogo: 'TestCategoryLogo'
    }


    it('should create data', async() => {
        const response = await createCategory(categoryData);
        //expect(response._id).toBeObject()
        expect(response).toHaveProperty('_id');

    })

    it('should call when param is invalid', async() => {

        let error = null;

        try {
            const response = await createCategory({});
            expect(response).toMatch('Invalid param')

        } catch (e) {
            error = e;
        }

        expect(error).not.toBeNull();

        //expect(next).toBeCalledWith(new Error('Invalid Data'));
    });

    // beforeEach(() => {

    // })


});