import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { escapeHtml, collectImages } from "./_utils.js";

describe("escapeHtml", () => {
  it("escapes markup characters", () => {
    assert.equal(
      escapeHtml(`<img src=x onerror="alert(1)">`),
      "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;"
    );
  });

  it("handles nullish values", () => {
    assert.equal(escapeHtml(null), "");
    assert.equal(escapeHtml(undefined), "");
  });
});

function fakeFile({ name, size, type }) {
  return new File([new Uint8Array(size)], name, { type });
}

describe("collectImages", () => {
  it("allows empty uploads when not required", () => {
    const formData = new FormData();
    const result = collectImages(formData, { required: false });
    assert.equal(result.error, undefined);
    assert.equal(result.files.length, 0);
  });

  it("requires at least one image when required", async () => {
    const formData = new FormData();
    const result = collectImages(formData, { required: true });
    assert.ok(result.error);
    assert.equal(result.error.status, 400);
  });

  it("rejects more than 3 images", () => {
    const formData = new FormData();
    for (let i = 0; i < 4; i++) {
      formData.append(
        "documents",
        fakeFile({ name: `a${i}.jpg`, size: 10, type: "image/jpeg" })
      );
    }
    const result = collectImages(formData, { required: false });
    assert.ok(result.error);
  });

  it("rejects non-images", () => {
    const formData = new FormData();
    formData.append(
      "documents",
      fakeFile({ name: "doc.pdf", size: 10, type: "application/pdf" })
    );
    const result = collectImages(formData, { required: false });
    assert.ok(result.error);
  });

  it("rejects over 20MB total", () => {
    const formData = new FormData();
    formData.append(
      "documents",
      fakeFile({
        name: "big.jpg",
        size: 21 * 1024 * 1024,
        type: "image/jpeg",
      })
    );
    const result = collectImages(formData, { required: false });
    assert.ok(result.error);
  });

  it("accepts up to 3 valid images under 20MB", () => {
    const formData = new FormData();
    for (let i = 0; i < 3; i++) {
      formData.append(
        "documents",
        fakeFile({ name: `a${i}.png`, size: 1024, type: "image/png" })
      );
    }
    const result = collectImages(formData, { required: true });
    assert.equal(result.error, undefined);
    assert.equal(result.files.length, 3);
  });
});
