// Small dependency-free text PDF writer. Each page carries its own content stream.
export function pdf(title: string, lines: string[]) {
  const ascii = (s: string) =>
    s
      .replace(/₦/g, "NGN ")
      .replace(/[–—·]/g, "-")
      .normalize("NFKD")
      .replace(/[^\x20-\x7E]/g, "");
  const escape = (s: string) => ascii(s).replace(/([\\()])/g, "\\$1");
  const wrapped = [title, "", ...lines].flatMap((s) => {
    const words = ascii(s).split(/\s+/);
    const result: string[] = [];
    let row = "";
    for (const word of words) {
      if ((row + word).length > 88) {
        result.push(row);
        row = "";
      }
      row += (row ? " " : "") + word;
    }
    result.push(row);
    return result;
  });
  const pages = Array.from(
    { length: Math.max(1, Math.ceil(wrapped.length / 45)) },
    (_, i) => wrapped.slice(i * 45, (i + 1) * 45),
  );
  const objects: string[] = [];
  objects[0] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[1] = `<< /Type /Pages /Kids [${pages.map((_, i) => `${4 + i * 2} 0 R`).join(" ")}] /Count ${pages.length} >>`;
  objects[2] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
  pages.forEach((page, i) => {
    const stream = `BT /F1 11 Tf 48 790 Td 16 TL ${page.map((line, j) => `${j ? "T* " : ""}(${escape(line)}) Tj`).join("\n")} ET`;
    objects[3 + i * 2] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${5 + i * 2} 0 R >>`;
    objects[4 + i * 2] =
      `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`;
  });
  let body = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((o, i) => {
    offsets.push(Buffer.byteLength(body));
    body += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const xref = Buffer.byteLength(body);
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets
    .slice(1)
    .map((n) => String(n).padStart(10, "0") + " 00000 n ")
    .join(
      "\n",
    )}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(body);
}
