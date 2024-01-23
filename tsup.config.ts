import { defineConfig } from "tsup";

export default defineConfig({
  entryPoints: ["src/index.ts"], // 指定入口文件
  external: ["lodash-es"], // 指定外部依赖库
  format: ["esm", "cjs"], // 指定输出格式
  outDir: "dist", // 指定输出目录
  clean: true, // 清理输出目录
  minify: true,
  dts: true, // 生成 .d.ts 类型声明文件
  splitting: true, // 拆分输出文件
});
