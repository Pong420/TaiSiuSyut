import React from 'react';
import { useRxAsync } from 'use-rx-hooks';
import {
  MixedConfirmOverlay,
  MixedOverlayProps
} from '@/components/MixedOverlay';
import { createUserForm } from '@/components/UserForm';
import { Toaster } from '@/utils/toaster';
import { getProfile, updateProfile as updateProfileAPI } from '@/service';
import { Param$UpdateUser, Schema$User } from '@/typings';
import { AuthState, AuthActions } from '@/hooks/useAuth';
import { createOpenOverlay } from '@/utils/openOverlay';
import { useState } from 'react';

interface Props extends MixedOverlayProps {
  auth: AuthState;
  actions: AuthActions;
}

const title = '更改帳號資料';

const { Form, Nickname, Email, useForm } = createUserForm();

const getProfileFailure = Toaster.apiError.bind(Toaster, `Get profile failure`);

export const openProfileUpdateOverlay = createOpenOverlay(ProfileUpdateOverlay);

export function ProfileUpdateOverlay({ auth, actions, ...props }: Props) {
  const [form] = useForm();
  const [onSuccess] = useState(() => (user: Schema$User) => {
    form.setFieldsValue(user);
    actions.updateProfile(user);
  });

  useRxAsync(getProfile, {
    defer: !!auth.user?.email,
    onSuccess,
    onFailure: getProfileFailure
  });

  async function onConfirm() {
    if (!auth.user?.id) {
      throw new Error(`user id is not defined`);
    }

    const payload = await form.validateFields();
    const changes: Param$UpdateUser = { id: auth.user.id };
    for (const [_key, value] of Object.entries(payload)) {
      const key = _key as Exclude<keyof Param$UpdateUser, 'id'>;
      if (value !== auth.user[key]) {
        changes[key] = value;
      }
    }

    try {
      const response = await updateProfileAPI(changes);
      actions.updateProfile(response);
      Toaster.success({ message: `Update profile success` });
    } catch (error) {
      Toaster.apiError(`Update profile failure`, error);
      throw error;
    }
  }

  return (
    <MixedConfirmOverlay
      {...props}
      title={title}
      icon="user"
      confirmText="確認"
      cancelText="取消"
      onConfirm={onConfirm}
    >
      <Form form={form} initialValues={auth.user || {}}>
        <Nickname />
        <Email />
      </Form>
    </MixedConfirmOverlay>
  );
}
