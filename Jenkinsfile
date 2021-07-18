import groovy.json.*

pipeline {
	agent any
	environment {
		APP_NAME = 'node-scaffold-cis'
		GROUP_NAME = 'nodeplayground'
		NEXUS_VERSION = 'nexus3'
		NEXUS_PROTOCOL = 'http'
		NEXUS_URL = 'ec2-54-216-103-90.eu-west-1.compute.amazonaws.com:8081'
		NEXUS_CREDENTIALS_ID = 'nexus-creds'
		NEXUS_ARTIFACT_VERSION_PREFIX = '1.0.'
		TEAMS_CHANNEL = ''
	}
	stages {
		stage ('Build Node Application') {
			when {
				not {
					anyOf {
						branch 'master'
						branch 'feature/*'
					}
				}
			}
			steps {
				sh(label: 'node dependencies', script: 'npm install')
				sh(label: 'node typescript build', script: 'npm run build')
				sh(label: 'zip files', script: 'cd dist && zip -r ../node-scaffold-cis.zip *')
			}
		}
		stage ('Quality Gate') {
			when {
				not {
					anyOf {
						branch 'master'
						branch 'feature/*'
					}
				}
			}
			parallel {
				stage('Running Unit Test & Sonar-Scanner') {
					steps {
						sh(label: 'running unit tests', script: 'sudo npm run test:coverage')
					}
				}
				stage('Code Quality Analysis') {
					steps {
						withSonarQubeEnv('SonarQube') {
							sh(label: 'running sonar-scanner', script: 'npm run test:sonar')
						}
						waitForQualityGate abortPipeline: true
					}
				}
			}
		}
		stage('Upload to Artifactory') {
			steps {
				script {
					if (env.BRANCH_NAME.contains('develop')) {
						REPOSITORY = 'metretail-artifacts-snapshot'
						VERSION = env.NEXUS_ARTIFACT_VERSION_PREFIX + '0-SNAPSHOT'
					}else {
						REPOSITORY = 'metretail-artifacts-release'
						VERSION = env.NEXUS_ARTIFACT_VERSION_PREFIX + env.BUILD_ID + '-RELEASE'
					}
					nexusArtifactUploader artifacts: [
					[artifactId: 'node-scaffold-cis',
					classifier: '',
					file: '/var/lib/jenkins/workspace/node-scaffold-cis.zip',
					type: 'zip'
					]
				],
					credentialsId: env.NEXUS_CREDENTIALS_ID,
					groupId: 'za.co.metropolitan.nodeplayground',
					nexusUrl: env.NEXUS_URL,
					nexusVersion: env.NEXUS_VERSION,
					protocol: env.NEXUS_PROTOCOL,
					repository: REPOSITORY,
					version: VERSION
				}
				
			}
		}
		stage('Deploy to DEV') {
			steps {
				script {
					if (env.BRANCH_NAME.contains('develop')) {
						//triggerDeployment(repository: 'metretail-artifacts-snapshot',build_env: 'dev')
						echo 'deploying to dev'
					} else if (env.BRANCH_NAME.contains('release')) {
						//triggerDeployment(repository: 'metretail-artifacts-release',build_env: 'tst')
						echo 'deploying to tst'
					}
				}
			}
		}
	}
}