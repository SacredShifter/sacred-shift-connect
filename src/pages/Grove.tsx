
import React from 'react';
import { PageLayout } from '@/components/ui/page-layout';
import SacredGrove from '@/components/SacredGrove/SacredGrove';

const Grove = () => {
  return (
    <PageLayout
      title="Sacred Grove"
      subtitle="A space for collective wisdom and sacred community."
    >
      <SacredGrove />
    </PageLayout>
  );
};

export default Grove;
