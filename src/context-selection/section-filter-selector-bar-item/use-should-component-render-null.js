import useDataSetSectionsInfo from './use-data-set-sections-info.js'

export default function useShouldComponentRenderNull() {
    const dataSetSectionsInfo = useDataSetSectionsInfo()

    return (
        !dataSetSectionsInfo.called ||
        dataSetSectionsInfo.loading ||
        dataSetSectionsInfo.error ||
        'SECTION' !== dataSetSectionsInfo.data?.formType ||
        dataSetSectionsInfo.data?.sections.length === 0
    )
}
