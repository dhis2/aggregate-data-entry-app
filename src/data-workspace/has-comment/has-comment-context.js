import { useContext, createContext } from 'react'

export const HasCommentContext = createContext({
    populateHasCommentContextForDataSetValues: (dataSetValues) => {
        throw new Error(
            `Context function "populateHasCommentContextForDataSetValues" not set. Provided dataSetValues of type "${typeof dataSetValues}".`
        )
    },

    updateHasCommentContext: (
        dataElementId,
        categoryOptionComboId,
        comment
    ) => {
        throw new Error(
            `Context function "updateHasCommentContext" not set. Tried to get dataElementId "${dataElementId}", categoryOptionComboId "${categoryOptionComboId}" and comment "${comment}".`
        )
    },

    hasComment: (fieldname) => {
        throw new Error(
            `Context function "hasComment" not set. Tried to get fieldname "${fieldname}".`
        )
    },
})

export const useHasCommentContext = () => useContext(HasCommentContext)

export const useHasComment = (fieldname) => {
    const { hasComment } = useHasCommentContext()
    return hasComment(fieldname)
}
