// styled-jsx 타입 선언 - Next.js 15에서 <style jsx> 문법 지원
import 'react';

declare module 'react' {
  interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}
