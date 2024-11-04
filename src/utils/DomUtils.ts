export class DomUtils {
    static readonly clickHandlerAttributeName = "data-is-click-handler";
    static readonly clickHandlerAttributeValue = "true";

    static hasAncestorWithOwnDefaultClickBehavior(target: Node, maxAncestor?: Node | string): boolean {
        let ancestor = target.parentElement;
        // eslint-disable-next-line no-unmodified-loop-condition
        while (ancestor && (maxAncestor === undefined || !DomUtils.isSameNodeOrHasSameTagName(ancestor, maxAncestor))) {
            if (DomUtils.doesNodeHaveOwnDefaultClickBehavior(ancestor)) {
                return true;
            }
            ancestor = ancestor.parentElement;
        }
        return false;
    }

    static doesNodeHaveOwnDefaultClickBehavior(target: Node): boolean {
        if (!(target instanceof Element)) {
            return false;
        }
        const tagName = target.tagName.toLowerCase();
        const tagNamesWithDefaultClickBehavior = ["a", "button", "input", "select", "textarea"];
        if (tagNamesWithDefaultClickBehavior.includes(tagName)) {
            return true;
        }
        if (
            target.hasAttribute(DomUtils.clickHandlerAttributeName) &&
            target.getAttribute(DomUtils.clickHandlerAttributeName) === DomUtils.clickHandlerAttributeValue
        ) {
            return true;
        }
        return false;
    }

    static isSameNodeOrHasSameTagName(target: Node, nodeOrTagName: Node | string): boolean {
        if (target === nodeOrTagName) {
            return true;
        }
        if (!(target instanceof Element)) {
            // No target.tagName and target !== nodeOrTagName
            return false;
        }
        if (typeof nodeOrTagName === "string") {
            return target.tagName.toLowerCase() === nodeOrTagName.toLowerCase();
        }
        return false;
    }
}
