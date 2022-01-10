import useDataSetSectionsInfo from './use-data-set-sections-info.js'

/*
 * `dataSetSectionsInfo.loading` does not mean that "null" should be rendered.
 * This happens automatically during the first loading as
 * `'SECTION' !== dataSetSectionsInfo.data?.formType` resolves to `true`.
 *
 * But when data is stale and this function has determined that the component
 * should not render `null`, then it's most likely not going to change when
 * reloading
 */
export default function useShouldComponentRenderNull() {
    const dataSetSectionsInfo = useDataSetSectionsInfo()

    return (
        !dataSetSectionsInfo.called ||
        'SECTION' !== dataSetSectionsInfo.data?.formType ||
        dataSetSectionsInfo.data?.sections.length === 0
    )
}
