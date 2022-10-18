/**
 * The format we receive from the API and what we want to
 * display is actually different. For now we'll format
 * the values on the client. After the initial release we
 * can think about whether we want to move this to the
 * backend or not.
 * @TODO: Create an issue for this
 */
export default function processAudits(audits) {
    const processedExistingAudits = [...audits].map((audit, index) => {
        const previousValue =
            audit?.auditType === 'CREATE'
                ? undefined
                : audits?.[index + 1]?.value

        return {
            ...audit,
            previousValue,
        }
    })

    return processedExistingAudits
}
