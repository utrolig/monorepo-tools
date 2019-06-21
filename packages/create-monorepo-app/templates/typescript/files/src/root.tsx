import React from "react";

type RootProps = {
  title: string;
};

export const Root: React.FC<RootProps> = ({ title }) => (
  <div>
    <h1>Hello from {title}</h1>
  </div>
);
