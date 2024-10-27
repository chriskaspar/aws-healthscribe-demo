import React, { useState } from 'react';

import Button from '@cloudscape-design/components/button';
import ButtonDropdown from '@cloudscape-design/components/button-dropdown';
import Container from '@cloudscape-design/components/container';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Link from '@cloudscape-design/components/link';
import { SelectProps } from '@cloudscape-design/components/select';
import SpaceBetween from '@cloudscape-design/components/space-between';

import Crunker from 'crunker';
import dayjs from 'dayjs';
import { Reorder } from 'framer-motion';

import { useNotificationsContext } from '@/store/notifications';
import { PollyPhrase, getAudioBlobFromPolly } from '@/utils/PollyApi';

import AudioLineBox from './AudioLineBox';
import styles from './GenerateAudio.module.css';
import { KNEE_PROBLEM } from './templates/knee';
import { SLEEP_APNEA } from './templates/sleep';
import { ABBVIE_CONVERSATION } from './templates/abbvie';
import { NOVARTIS_CONVERSATION } from './templates/novartis';
import { PFIZER_CONVERSATION } from './templates/pfizer';
import { LIFETOUCH_INITIAL_CONVERSATION } from './templates/LifeTouchInitial';
import { LIFETOUCH_FOLLOWUP_CONVERSATION } from './templates/LifeTouchFollowup';

const crunker = new Crunker();

export type AudioLine = {
    id: number;
    speaker: SelectProps.Option | null;
    text: string;
};
type AudioLines = AudioLine[];
const DEFAULT_AUDIOLINES = [{ id: 1, speaker: null, text: '' }] as AudioLines;

const PROGRESS_BAR_ID = 'Generating audio file';

export default function GenerateAudio() {
    const { addFlashMessage, updateProgressBar } = useNotificationsContext();

    const [audioLines, setAudioLines] = useState<AudioLines>(DEFAULT_AUDIOLINES);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);

    function validateAudioLine(audioLine: AudioLine) {
        if (!audioLine.speaker?.value) {
            addFlashMessage({
                id: 'generateAudio-invalidAudioLine',
                header: 'Generate Audio',
                content: `Audio line requires a speaker. See line ${audioLine.id}`,
                type: 'error',
                dismissible: true,
            });
            return false;
        } else if (!audioLine.text) {
            addFlashMessage({
                id: 'generateAudio-invalidAudioLine',
                header: 'Generate Audio',
                content: `Audio line requires text. See line ${audioLine.id}`,
                type: 'error',
                dismissible: true,
            });
            return false;
        } else {
            return true;
        }
    }

    function updateAudioLineSpeaker(id: number, selectedOption: SelectProps.Option) {
        const newAudioLines = audioLines.map((audioLine) => {
            if (audioLine.id === id) {
                return { ...audioLine, speaker: selectedOption };
            }
            return audioLine;
        });
        setAudioLines(newAudioLines);
    }

    function updateAudioLineText(id: number, value: string) {
        const newAudioLines = audioLines.map((audioLine) => {
            if (audioLine.id === id) {
                return { ...audioLine, text: value };
            }
            return audioLine;
        });
        setAudioLines(newAudioLines);
    }

    function removeAudioLine(id: number) {
        if (audioLines.length === 1) {
            addFlashMessage({
                id: 'generateAudio-removeLastAudioLine',
                header: 'Generate Audio',
                content: 'You need at least one line of text to generate audio.',
                type: 'error',
                dismissible: true,
            });
            return;
        } else {
            setAudioLines(audioLines.filter((audioLine) => audioLine.id !== id));
        }
    }

    function addNewAudioLine() {
        const newId = Math.max(...audioLines.map((a) => a.id)) + 1;
        setAudioLines([...audioLines, { id: newId, speaker: null, text: '' }]);
    }

    function loadTemplate(templateId: string) {
        switch (templateId) {
            case 'kneeProblem':
                setAudioLines(KNEE_PROBLEM);
                break;
            case 'sleepApnea':
                setAudioLines(SLEEP_APNEA);
                break;
            case 'abbvieHumira':
                setAudioLines(ABBVIE_CONVERSATION);
                break;
            case 'novartisEntresto':
                setAudioLines(NOVARTIS_CONVERSATION);
                break;
            case 'pfizerIbrance':
                setAudioLines(PFIZER_CONVERSATION);
                break;
            case 'lifeTouchInitial':
                setAudioLines(LIFETOUCH_INITIAL_CONVERSATION);
                break;
            case 'lifeTouchFollowup':
                setAudioLines(LIFETOUCH_FOLLOWUP_CONVERSATION);
                break;
            default:
                break;
        }
    }

    async function generateAudio() {
        if (audioLines.length === 0) {
            addFlashMessage({
                id: 'generateAudio-noAudioLines',
                header: 'Generate Audio',
                content: 'You need at least one line of text to generate audio.',
                type: 'error',
                dismissible: true,
            });
            return;
        }
        if (audioLines.some((audioLine) => !validateAudioLine(audioLine))) return;

        setIsDownloading(true);
        updateProgressBar({
            id: PROGRESS_BAR_ID,
            value: 0,
            description: 'Audio generation using Amazon Polly in progress...',
        });
        try {
            const conversationAudio: AudioBuffer[] = [];
            for (const [ind, audioLine] of audioLines.entries()) {
                const getAudioInput = {
                    voiceId: audioLine.speaker?.value,
                    text: audioLine.text,
                };
                const pollyAudioBlob = await getAudioBlobFromPolly(getAudioInput as PollyPhrase);
                const pollyAudioBuffer = await crunker.fetchAudio(pollyAudioBlob);
                const paddedPollyAudioBuffer = crunker.padAudio(pollyAudioBuffer[0], undefined, 0.5);
                conversationAudio.push(paddedPollyAudioBuffer);
                const percentDone = Math.round(((ind + 1) / audioLines.length) * 100);
                updateProgressBar({
                    id: PROGRESS_BAR_ID,
                    value: percentDone,
                    description: `Generated audio part ${ind + 1} of ${audioLines.length}`,
                });
            }
            const concatAudio = crunker.concatAudio(conversationAudio);
            const exportedAudio = crunker.export(concatAudio, 'audio/mp3');

            const link = document.createElement('a');
            link.href = exportedAudio.url;
            link.setAttribute('download', `AWS-HealthScribe-Demo-${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.wav`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            updateProgressBar({
                id: PROGRESS_BAR_ID,
                type: 'success',
                value: 100,
                description: 'Audio file generated. Check your downloads folder.',
            });
            setIsDownloading(false);
        } catch (e) {
            updateProgressBar({
                id: PROGRESS_BAR_ID,
                type: 'error',
                value: 0,
                description: 'Audio generation failed',
                additionalInfo: `Error generating audio: ${(e as Error).message}`,
            });
            setIsDownloading(false);
            throw e;
        }
    }

    return (
        <ContentLayout
            headerVariant={'high-contrast'}
            header={
                <Header
                    variant="h1"
                    description={
                        <>
                            Use{' '}
                            <Link external href="https://aws.amazon.com/polly">
                                Amazon Polly
                            </Link>{' '}
                            to generate an audio file.
                        </>
                    }
                    actions={
                        <SpaceBetween direction="horizontal" size="xs">
                            <ButtonDropdown
                                onItemClick={({ detail }) => loadTemplate(detail.id)}
                                items={[
                                    { text: 'Knee Mock Visit', id: 'kneeProblem' },
                                    { text: 'Sleep Mock Visit', id: 'sleepApnea' },
                                    { text: 'AbbVie Humira Mock Visit', id: 'abbvieHumira' },
                                    { text: 'Novartis Entresto Mock Visit', id: 'novartisEntresto' },
                                    { text: 'Pfizer Ibrance Mock Visit', id: 'pfizerIbrance' },
                                    { text: 'LifeTouch Initial Call', id: 'lifeTouchInitial' },
                                    { text: 'LifeTouch Follow-Up Call', id: 'lifeTouchFollowup' },
                                ]}
                                disabled={isDownloading}
                            >
                                Load Template
                            </ButtonDropdown>
                            <Button
                                onClick={() => setAudioLines(DEFAULT_AUDIOLINES)}
                                disabled={isDownloading || audioLines === DEFAULT_AUDIOLINES}
                            >
                                Reset
                            </Button>
                            <Button
                                onClick={() => generateAudio()}
                                variant="primary"
                                loading={isDownloading}
                                disabled={audioLines === DEFAULT_AUDIOLINES}
                            >
                                Download
                            </Button>
                        </SpaceBetween>
                    }
                >
                    Generate Audio
                </Header>
            }
        >
            <Container
                disableContentPaddings={true}
                footer={<Button onClick={() => addNewAudioLine()}>Add New Line</Button>}
            >
                <Reorder.Group axis="y" values={audioLines} onReorder={setAudioLines} className={styles.reorderGroupUl}>
                    {audioLines.map((audioLine) => (
                        <Reorder.Item key={audioLine.id} value={audioLine}>
                            <AudioLineBox
                                audioLine={audioLine}
                                validateAudioLine={validateAudioLine}
                                updateAudioLineText={updateAudioLineText}
                                updateAudioLineSpeaker={updateAudioLineSpeaker}
                                removeAudioLine={removeAudioLine}
                            />
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            </Container>
        </ContentLayout>
    );
}
