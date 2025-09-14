import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Toast } from "./Toast";
import { Button } from "./Button";

const meta: Meta<typeof Toast> = {
  title: "UI/Toast",
  component: Toast,
};
export default meta;
type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  render: () => {
    const [show, setShow] = useState(false);

    return (
      <>
        <Button onClick={() => setShow(true)}>Show Toast</Button>
        {show && (
          <Toast
            message="This is a toast!"
            type="success"
            onClose={() => setShow(false)}
          />
        )}
      </>
    );
  },
};
