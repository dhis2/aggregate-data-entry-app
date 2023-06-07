/**
 * @params {[
 *   {
 *       dataElement: string
 *       categoryOptionCombo: string
 *       value: string | number
 *   }
 * ]}
 * @returns {{
 *   [dataElementId: string]: {
 *       [cocId: string]: {
 *           dataElement: string
 *           categoryOptionCombo: string
 *           value: string | number
 *       }
 *   }
 * }}
 */
export default function mapDataValuesToFormInitialValues(dataValues) {
    // It's possible for the backend to return a response
    // that does not have dataValues
    if (!dataValues) {
        return {}
    }

    const formInitialValues = dataValues.reduce((acc, dataValueData) => {
        if (!acc[dataValueData.dataElement]) {
            acc[dataValueData.dataElement] = {
                [dataValueData.categoryOptionCombo]: dataValueData,
            }
        } else {
            acc[dataValueData.dataElement][dataValueData.categoryOptionCombo] =
                dataValueData
        }

        return acc
    }, {})

    return formInitialValues
}
