import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/layout/PageHeader';
import EmptyState from '../../components/common/EmptyState';

const Projects = () => {
	return (
		<PageContainer>
			<PageHeader
				title="Project Management"
				description="Create, assign, and track projects across interns and tasks."
			/>
			<EmptyState
				title="No Projects Available"
				description="Start by creating a project to organize related tasks and intern assignments."
			/>
		</PageContainer>
	);
};

export default Projects;
