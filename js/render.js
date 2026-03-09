"use strict";
function createTag(tagName, text, className) {
    const el = document.createElement(tagName);
    if (text)
        el.textContent = text;
    if (className)
        el.className = className;
    return el;
}
function appendBadges(line, badges = []) {
    for (const badge of badges) {
        const badgeEl = createTag("span", badge.text, badge.className);
        line.appendChild(badgeEl);
        line.appendChild(document.createTextNode(" "));
    }
}
function appendPresentations(line, presentations = []) {
    presentations.forEach((presentation, index) => {
        const p = createTag("span", presentation.text, presentation.className);
        line.appendChild(p);
        if (index < presentations.length - 1) {
            line.appendChild(document.createTextNode(" / "));
        }
    });
}
function renderPublicationList(container, categories = []) {
    for (const category of categories) {
        const wrapper = createTag("div", "", "research-category");
        wrapper.appendChild(createTag("h3", category.title));
        const ol = createTag("ol");
        for (const item of category.items || []) {
            const li = createTag("li");
            li.appendChild(createTag("span", item.authors, "u-author"));
            if (item.url) {
                const link = createTag("a", item.title, "u-paper-name");
                link.href = item.url;
                li.appendChild(link);
            }
            else {
                li.appendChild(createTag("span", item.title, "u-paper-name"));
            }
            li.appendChild(document.createElement("br"));
            const badgeLine = createTag("span");
            appendBadges(badgeLine, item.badges);
            li.appendChild(badgeLine);
            li.appendChild(document.createElement("br"));
            const presentationLine = createTag("span");
            appendPresentations(presentationLine, item.presentations);
            if (item.presentations.length > 0) {
                presentationLine.appendChild(document.createTextNode(" "));
            }
            presentationLine.appendChild(createTag("span", `: ${item.where}`, "u-where"));
            li.appendChild(presentationLine);
            ol.appendChild(li);
        }
        wrapper.appendChild(ol);
        container.appendChild(wrapper);
    }
}
function renderSkills(root, skills) {
    root.appendChild(createTag("h3", "Skills"));
    const ul = createTag("ul");
    for (const item of skills.items) {
        ul.appendChild(createTag("li", item));
    }
    if (skills.atcoder) {
        const li = createTag("li");
        li.textContent = "AtCoder Algorithm -- ";
        li.appendChild(createTag("span", skills.atcoder.rateText, "u-atcoder-color"));
        ul.appendChild(li);
        const refLi = createTag("li");
        refLi.textContent = "c.f. ";
        const a = createTag("a", skills.atcoder.referenceText);
        a.href = skills.atcoder.referenceUrl;
        refLi.appendChild(a);
        ul.appendChild(refLi);
    }
    root.appendChild(ul);
}
function renderLanguages(root, languages) {
    root.appendChild(createTag("h3", "Programming Languages"));
    const table = createTag("table", "", "u-full-width");
    const thead = createTag("thead");
    const headerRow = createTag("tr");
    headerRow.appendChild(createTag("th", "言語名"));
    headerRow.appendChild(createTag("th", "使用目的・スキル"));
    thead.appendChild(headerRow);
    const tbody = createTag("tbody");
    for (const lang of languages) {
        const row = createTag("tr");
        row.appendChild(createTag("td", lang.name));
        row.appendChild(createTag("td", lang.usage));
        tbody.appendChild(row);
    }
    table.appendChild(thead);
    table.appendChild(tbody);
    root.appendChild(table);
}
function renderLinks(root, links) {
    root.appendChild(createTag("h2", "Links"));
    const ul = createTag("ul");
    for (const link of links) {
        const li = createTag("li");
        li.textContent = `${link.label}: `;
        const a = createTag("a", link.url);
        a.href = link.url;
        li.appendChild(a);
        ul.appendChild(li);
    }
    root.appendChild(ul);
}
async function main() {
    const app = document.getElementById("app");
    const loading = document.getElementById("loading");
    if (!(app instanceof HTMLElement) || !(loading instanceof HTMLElement)) {
        throw new Error("required root elements are missing");
    }
    try {
        const response = await fetch("data/site-data.json");
        if (!response.ok) {
            throw new Error(`failed to load data: ${response.status}`);
        }
        const data = (await response.json());
        loading.remove();
        const profile = createTag("p", "", "u-gray");
        for (const line of data.profile.lines) {
            profile.appendChild(document.createTextNode(line));
            profile.appendChild(document.createElement("br"));
        }
        app.appendChild(profile);
        app.appendChild(createTag("h2", "Affiliation"));
        const affiliation = createTag("p");
        for (const line of data.affiliation.ja) {
            affiliation.appendChild(document.createTextNode(line));
            affiliation.appendChild(document.createElement("br"));
        }
        affiliation.appendChild(createTag("span", data.affiliation.en, "u-gray"));
        app.appendChild(affiliation);
        app.appendChild(createTag("h2", "Research"));
        renderPublicationList(app, data.researchCategories);
        app.appendChild(createTag("h2", "Works"));
        renderPublicationList(app, data.workCategories);
        app.appendChild(createTag("h2", "Career"));
        const careerList = createTag("ul");
        for (const entry of data.career) {
            careerList.appendChild(createTag("li", entry));
        }
        app.appendChild(careerList);
        app.appendChild(createTag("h2", "Profile"));
        renderSkills(app, data.skills);
        renderLanguages(app, data.languages);
        app.appendChild(createTag("h3", "Interest"));
        app.appendChild(document.createTextNode(data.interest));
        app.appendChild(createTag("h3", "Hobby"));
        app.appendChild(document.createTextNode(data.hobby));
        app.appendChild(createTag("hr"));
        renderLinks(app, data.links);
        app.appendChild(createTag("hr"));
        const footnote = createTag("p", "", "u-footnote");
        footnote.appendChild(document.createTextNode("このサイトはCSSフレームワーク「"));
        const skeleton = createTag("a", "Skeleton");
        skeleton.href = "http://getskeleton.com";
        footnote.appendChild(skeleton);
        footnote.appendChild(document.createTextNode("」を用いてデザインされています。"));
        app.appendChild(footnote);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        loading.textContent = `データの読み込みに失敗しました: ${message}`;
    }
}
void main();
