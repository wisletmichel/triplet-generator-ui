import { v4 as uuidv4 } from 'uuid';
export const toRequest = (useCaseLanguage, sentences=[]) => {
    return {
        requestId: uuidv4(),
        body: {
            useCaseLanguage,
            sentences
        }
    }
};
