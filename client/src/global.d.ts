declare module "*.css" {
    const content: { [className: string]: string };
    export = content;
}

declare module "SignIn.module.css";